const chat_container = document.getElementById('chat')
const match_container = document.getElementById("matches")
const messages = document.getElementById("messages")
const message_input = document.getElementById("chat_input")

const address = "https://vf-cbc-ai-server.onrender.com"



const saveID=(id)=>{
    // key is visiola_cbc_ai_1
    localStorage.setItem("visiola_cbc_ai_1",id)
}

const generateId = () => {
    // generate a random string of length 4
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    saveID(id)
    return id
}

const getID=()=>{
    const id = localStorage.getItem("visiola_cbc_ai_1")
    if (id === undefined){
        generateId()
    }

    return localStorage.getItem("visiola_cbc_ai_1")
}

// api requests
const sendMessage = (method,endpoint,data={}) => {
    data["id"] = getID() //add user id, to allow chatbot track message history 
    return new Promise((resolve, reject) => {
        fetch(`${address}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`http_${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            // ensure callers get an Error object
            reject(err instanceof Error ? err : new Error(String(err)))
        })
    })
}

const showResults=()=>{
    chat_container.style.display = "none"
    match_container.style.display = "block"
    message_input.style.display = "none"
}

const showChats=()=>{
    chat_container.style.display = "block"
    match_container.style.display = "none"
    message_input.style.display = "block"
}

const addAIMessage=message=>{
    messages.insertAdjacentHTML('beforeend',` <div class="flex items-end gap-3 p-4">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWPASX3A8e0dUsGlogk8uMc7IFZPqyBpru69xF86w9KHvnMsivxxU4uKYew1-olTHlKHA_q8IPKQUm2wmHwRGCpmNCE_sdxbyOrnpJiO459ej3pdxHNMtyd1fXG6Ndt9H4NAzchOb7uU7g5KELwEhQiuXu9g-ujz9548KPUlWflWTps3U0ZGUTF7_zkkXAQSiywxU1qtXKamjmwfj88Gxo9kRV1TBpOwJs43w0AFcbV9yR11214h5JVIvBMeBgiRLM7vzbm6JNnqg");'
              ></div>
              <div class="flex flex-1 flex-col gap-1 items-start">
                <p class="text-[#4c739a] text-[13px] font-normal leading-normal max-w-[360px]">AI Assistant</p>
                <p class="text-base font-normal leading-normal flex max-w-[360px] rounded-lg px-4 py-3 bg-[#e7edf3] text-[#0d141b]">${message}</p>
              </div>
            </div>`)
}

const addHumanMessage=message=>{
    messages.insertAdjacentHTML('beforeend',`<div class="flex items-end gap-3 p-4 justify-end">
              <div class="flex flex-1 flex-col gap-1 items-end">
                <p class="text-[#4c739a] text-[13px] font-normal leading-normal max-w-[360px] text-right">Me</p>
                <p class="text-base font-normal leading-normal flex max-w-[360px] rounded-lg px-4 py-3 bg-[#1380ec] text-slate-50">${message}</p>
              </div>
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkJDzBFtHLhBfWGbsjJjiyAAaWJSTYldBKzoJ07qovXCQT7w0rvLYN1StX2AL1IsnZYU-Suaf9Kglkj1PujkfiDPv5NT1x_LTQ_W_UQjYDIC4PHomKoUtQBDuxPUvR45nJtajqbr5afVER4wgDB1TO9srloBCrmuZVNZKWhsagxmmFPsOmXxZtfXEFnAOrczWdv1opmsFZXWJ6kcbuMYP-ZizZy5ZCaIqdmTfBvbRATHgTI4cwcBc5GKOWYCA8Lr9_bgZ4Vh0s4nU");'
              ></div>
            </div>`)
}

const removeLastMessage=()=>{
    const lastChild = messages.lastElementChild;
    if (lastChild) {
        messages.removeChild(lastChild);
    }
}

const submitMessage=(message=null)=>{
    const value = message? {value:message} : document.getElementsByName('input')[0]
    
    if(value !== undefined && value.value.length > 0){
        console.log("sending message : ",value.value);
        addHumanMessage(value.value)
        addAIMessage("...")
        sendMessage("post","group1/",{message:value.value})
        .then(res=>{
          console.log(res);
          removeLastMessage()
          value.value = ""
          addAIMessage(res.ai_response)
        })
        

    }
}

window.addEventListener("load",()=>{
    generateId()
    addAIMessage("Hello! how can I help you today?")
})