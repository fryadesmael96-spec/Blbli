import streamlit as st
import google.generativeai as genai

# ڕێکخستنی لاپەڕەکە بۆ ئەوەی لە مۆبایل جوان دیار بێت
st.set_page_config(page_title="AI App", layout="centered")

# وەرگرتنی کلیلەکە بە شێوەیەکی پارێزراو
api_key = st.secrets["GOOGLE_API_KEY"]
genai.configure(api_key=api_key)

st.title("بەرنامەی زیرەکی دەستکرد")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("لێرە بنوسە..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        with st.chat_message("assistant"):
            st.markdown(response.text)
        st.session_state.messages.append({"role": "assistant", "content": response.text})
    except Exception as e:
        st.error(f"هەڵەیەک ڕوویدا: {e}")
