import re, time
from datetime import datetime
from urllib.parse import quote_plus
from flask import Flask, request, jsonify, make_response
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
UA = {"User-Agent": "InfinityRogers/1.0 (+local demo)"}

def ddg_instant_answer(q):
    url = f"https://api.duckduckgo.com/?q={quote_plus(q)}&format=json&no_html=1&skip_disambig=1"
    try:
        r = requests.get(url, headers=UA, timeout=10)
        d = r.json()
        txt = d.get("Answer") or d.get("AbstractText") or d.get("Definition") or ""
        if not txt and d.get("RelatedTopics"):
            rt = d["RelatedTopics"][0]
            if isinstance(rt, dict): txt = rt.get("Text") or ""
        link = d.get("AbstractURL") or f"https://duckduckgo.com/?q={quote_plus(q)}"
        return {"source":"DuckDuckGo IA","url":link,"text":(txt or "").strip()}
    except Exception as e:
        return {"source":"DuckDuckGo IA","url":url,"text":f"(error) {e}"}

def wikipedia_summary(q):
    try:
        sr = requests.get(f"https://en.wikipedia.org/w/rest.php/v1/search/title?q={quote_plus(q)}&limit=1", headers=UA, timeout=10).json()
        if sr.get("pages"):
            key = sr["pages"][0].get("key")
            if key:
                r = requests.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote_plus(key)}", headers=UA, timeout=10).json()
                extract = (r.get("extract") or "").strip()
                url = (r.get("content_urls",{}).get("desktop",{}) or {}).get("page") or f"https://en.wikipedia.org/wiki/{quote_plus(key)}"
                return {"source":"Wikipedia","url":url,"text":extract}
    except Exception as e:
        return {"source":"Wikipedia","url":"https://en.wikipedia.org","text":f"(error) {e}"}
    return {"source":"Wikipedia","url":"https://en.wikipedia.org","text":""}

def wikidata_blurb(q):
    url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&limit=1&search={quote_plus(q)}"
    try:
        d = requests.get(url, headers=UA, timeout=10).json()
        if d.get("search"):
            it = d["search"][0]
            title = it.get("label","") or ""
            desc = it.get("description","") or ""
            item_id = it.get("id","") or ""
            link = f"https://www.wikidata.org/wiki/{item_id}" if item_id else "https://www.wikidata.org/"
            text = (title+" — "+desc).strip(" —")
            return {"source":"Wikidata","url":link,"text":text}
    except Exception as e:
        return {"source":"Wikidata","url":url,"text":f"(error) {e}"}
    return {"source":"Wikidata","url":"https://www.wikidata.org","text":""}

def ddg_snippet(q):
    url = f"https://duckduckgo.com/html/?q={quote_plus(q)}"
    try:
        soup = BeautifulSoup(requests.get(url, headers=UA, timeout=10).text, "html.parser")
        a = soup.select_one("a.result__a"); snip = ""
        if a:
            parent = a.find_parent("div", class_="result__body")
            if parent:
                s = parent.select_one(".result__snippet")
                snip = s.get_text(" ", strip=True) if s else ""
        return {"source":"DuckDuckGo Web","url":url,"text":snip}
    except Exception as e:
        return {"source":"DuckDuckGo Web","url":url,"text":f"(error) {e}"}

SOURCES = [ddg_instant_answer, wikipedia_summary, wikidata_blurb, ddg_snippet]

def merge_summaries(parts):
    seen=set(); out=[]
    for p in parts:
        t=(p.get("text") or "").strip()
        if not t: continue
        for s in re.split(r"(?<=[.!?])\\s+", t):
            s=s.strip()
            if 3<=len(s)<=240 and s.lower() not in seen:
                seen.add(s.lower()); out.append(s)
    return out[:8]

HTML = """<!doctype html><html><head>
<meta charset=utf-8><meta name=viewport content="width=device-width, initial-scale=1">
<title>Powered by INFINITY • Rogers AI (PayPal Demo)</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
<div class="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-neutral-200">
  <div class="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <span class="inline-block h-3 w-3 rounded-full" style="background: radial-gradient(circle at 30% 30%, #60a5fa, #2563eb);"></span>
      <div class="text-[15px] font-semibold tracking-tight">Powered by <span class="uppercase">INFINITY</span> • Rogers AI</div>
      <span class="ml-2 italic font-semibold text-[14px] text-amber-600/90 border border-amber-400/60 rounded px-1.5 py-0.5">PayPal</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-[13px] font-semibold shadow-sm">🪶 <span id="feathers">0</span></div>
    </div>
  </div>
</div>
<div class="mx-auto max-w-2xl w-full flex-1 px-4 pt-3 pb-2">
  <div id="chat" class="h-[62vh] sm:h-[66vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-3 flex flex-col gap-3"></div>
  <div class="mt-3 flex items-end gap-2">
    <div class="flex-1 rounded-2xl border border-neutral-300 bg-white px-3 py-2 shadow-inner">
      <textarea id="input" rows="2" placeholder="Talk to me, Kris — fast, on-page answers with sources." class="w-full resize-none outline-none text-[15px] placeholder:text-neutral-400"></textarea>
    </div>
    <button id="sendBtn" class="rounded-2xl bg-blue-600 text-white font-semibold px-4 py-2 shadow hover:bg-blue-700 active:translate-y-px">Send</button>
  </div>
  <div class="mt-2 flex items-center gap-3 text-[14px]">
    <label class="flex items-center gap-2"><input type="radio" name="mode" value="poll" checked> Poll many</label>
    <label class="flex items-center gap-2"><input type="radio" name="mode" value="chain"> Chain (telephone)</label>
  </div>
  <div class="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 text-[15px] leading-6">
    <div class="font-extrabold text-[17px] flex items-center gap-2">🪶 Infinity Tokens — <span class="font-semibold">Your on-site currency (no USD).</span></div>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>You earn tokens each time you chat; bigger ideas earn a few extra.</li>
      <li>Tokens are used for marketplace perks and AI utilities inside Infinity.</li>
      <li><span class="font-semibold">Watson • Gemini • ChatGPT</span> are filtered by Infinity Rogers and summarized here.</li>
      <li class="font-semibold">No API keys required.</li>
    </ul>
  </div>
</div>
<script>
const $=(s)=>document.querySelector(s), chat=$("#chat"), input=$("#input"), sendBtn=$("#sendBtn"), feathersEl=$("#feathers");
let name=localStorage.getItem("rogers_name")||"Kris";
let feathers=parseInt(localStorage.getItem("infinity_tokens")||"0"); feathersEl.textContent=feathers;
add("assistant",`Hi ${name} — Infinity tokens are active. Every message earns a 🪶. Rogers routes across external AIs and the open web, then summarizes here.`);
function add(role,text){const w=document.createElement("div");w.className="flex "+(role==="user"?"justify-end":"justify-start");
  const b=document.createElement("div"); b.className="max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow "+(role==="user"?"bg-blue-600 text-white":"bg-blue-50 text-neutral-900 border border-blue-100");
  b.style.wordBreak="break-word"; b.textContent=text; w.appendChild(b); chat.appendChild(w); chat.scrollTop=chat.scrollHeight;}
function mode(){const c=document.querySelector("input[name='mode']:checked"); return c?c.value:"poll";}
async function ask(q){ feathers+=1; feathersEl.textContent=feathers; localStorage.setItem("infinity_tokens",feathers.toString());
  try{ const r=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,mode:mode()})});
    const d=await r.json(); const parts=[]; if(d.summary&&d.summary.length) parts.push(d.summary.join(" "));
    if(d.answers&&d.answers.length){ const srcs=d.answers.filter(a=>(a.text||"").trim()).map(a=>a.source); if(srcs.length) parts.push("\\nSources: "+srcs.join(" • ")); }
    add("assistant", parts.join("\\n\\n") || "No clean text found. Try rephrasing."); }
  catch(e){ add("assistant","Network error."); }}
sendBtn.addEventListener("click",()=>{const q=input.value.trim(); if(!q) return; add("user",q); input.value=""; ask(q);});
input.addEventListener("keydown",(e)=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendBtn.click(); }});
</script></body></html>"""
@app.route("/")
def index():
    return make_response(HTML)

def merge_mode(q, mode):
    answers=[]
    if mode=="poll":
        for fn in SOURCES:
            answers.append(fn(q)); time.sleep(0.1)
    else:
        carry=q
        for fn in SOURCES:
            ans=fn(carry); answers.append(ans)
            prev=(ans.get("text") or "").strip()
            if prev: carry=f"{q}. Prior answer: {prev[:300]}"
    return answers

@app.route("/api/ask", methods=["POST"])
def api_ask():
    data = request.get_json(force=True, silent=True) or {}
    q = (data.get("question") or "").strip()
    mode = (data.get("mode") or "poll").lower()
    if not q: return jsonify({"error":"missing question"}), 400
    answers = merge_mode(q, mode)
    return jsonify({"question": q,"mode": mode,"answers": answers,"summary": merge_summaries(answers),"ts": datetime.utcnow().isoformat()+"Z"})
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=False)
