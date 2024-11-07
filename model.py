from openai import OpenAI
import os

# Set your API key

os.environ['OPENAI_API_KEY'] = 'sk-proj-8AXdCp7kqTq8jR0wEFeFT3BlbkFJhv5fT30dNou1q6djcjnS'

client = OpenAI()

prompt = "Generate CSV for me with car brand, car sold, and date sold."

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You will be provided with instructions on what to fill into a csv file. Create csv based on the description and do not add anything else. Please print in csv format."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.7,  # Adjust for creativity
    top_p=0.9,        # Adjust for diversity
)
print(response.choices[0].message.content)