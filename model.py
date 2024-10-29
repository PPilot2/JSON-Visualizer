import pandas as pd
from datasets import Dataset
from transformers import T5ForConditionalGeneration, T5Tokenizer, Trainer, TrainingArguments, AutoTokenizer, AutoModelForCausalLM
from sklearn.model_selection import train_test_split
from huggingface_hub import login
import torch
import os
from dotenv import load_dotenv
load_dotenv('.env')

huggingface_access_key = os.getenv('HUGGINGFACE_ACCESS_TOKEN')
login(huggingface_access_key)

# Load your dataset (replace with your own CSV data)
data = {
    "prompt": ["Generate CSV data for sales report", "Generate CSV for employee details"],
    "output": ["Name,Sales\nAlice,5000\nBob,7000", "Name,Age,Department\nJohn,30,HR\nDoe,28,IT"]
}
df = pd.DataFrame(data)

# Convert to Hugging Face Dataset
dataset = Dataset.from_pandas(df)

# Initialize T5 tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-4k-instruct", trust_remote_code=True)
# model.load_state_dict(torch.load('/models/model_state_dict.pth'))  

# Tokenize the dataset
def tokenize_function(examples):
    model_inputs = tokenizer(examples["prompt"], max_length=50, truncation=True, padding='max_length')
    labels = tokenizer(examples["output"], max_length=150, truncation=True, padding='max_length').input_ids
    
    # Replace -100 with the correct value for the labels that should be ignored (padding tokens)
    labels = [label if label != tokenizer.pad_token_id else -100 for label in labels]
    
    model_inputs["labels"] = labels
    return model_inputs

tokenized_dataset = dataset.map(tokenize_function, batched=True)


# Initialize Trainer

# Split the dataset into training and validation sets
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Convert to Hugging Face Dataset
train_dataset = Dataset.from_pandas(train_df)
val_dataset = Dataset.from_pandas(val_df)

# Tokenize the datasets
train_tokenized = train_dataset.map(tokenize_function, batched=True)
val_tokenized = val_dataset.map(tokenize_function, batched=True)

# Set training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=4,
    num_train_epochs=10,
    weight_decay=0.01,
)
# Initialize Trainer with validation dataset
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_tokenized,
    eval_dataset=val_tokenized,  # Add validation dataset here
)

# Train the model
trainer.train()

# Save the model
torch.save(model.state_dict(), 'models/model_state_dict.pth')
tokenizer.save_pretrained("./t5-csv-generator")

# Load the trained model
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-4k-instruct", trust_remote_code=True)
# model.load_state_dict(torch.load('/models/model_state_dict.pth'))  
tokenizer = AutoTokenizer.from_pretrained("./t5-csv-generator")

def generate_csv(prompt):
    input_ids = tokenizer(prompt, return_tensors="pt")
    output = model.generate(**input_ids)
    return tokenizer.decode(output[0], skip_special_tokens=True)

# Example usage
prompt = "Generate a CSV for a personal to-do list with columns Task, Deadline, Priority, and Status."
csv_data = generate_csv(prompt)
print(csv_data)
