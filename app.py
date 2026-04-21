import vertexai
from vertexai.generative_models import GenerativeModel

# ١. ناساندنی پڕۆژەکەت لە گۆگڵ کڵاود
vertexai.init(project="project-a77eb02f-bda2-4c55-9a5", location="us-central1")

# ٢. دیاریکردنی مۆدێلەکە
model = GenerativeModel("gemini-3.1-flash-lite-preview")

# ٣. ناردنی داواکاری و وەرگرتنی وەڵام
def generate_text(prompt):
    response = model.generate_content(prompt)
    return response.text

if __name__ == "__main__":
    user_input = input("چی دەپرسیت؟: ")
    print(generate_text(user_input))
