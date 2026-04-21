import streamlit as st
import google.generativeai as genai

# لێرە کلیلەکەت دابنێ
genai.configure(api_key="AIzaSyBaVjnfoa9ylH93NmWBZamuHGls8cBxrC8")

st.title("بەرنامەی تایبەتی من (Vertex AI)")

if "messages" not in st.session_state:
    st.session_state.messages = []

# پیشاندانی چاتەکە
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# وەرگرتنی پرسیار لە بەکارهێنەر
if prompt := st.chat_input("چی بنوسم؟"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # وەرگرتنی وەڵام لە Gemini
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    
    with st.chat_message("assistant"):
        st.markdown(response.text)
    st.session_state.messages.append({"role": "assistant", "content": response.text})
