import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-0efcb034353747b688a8953511326784',
});

async function main() {
  try {
    console.log('Testing DeepSeek API...');
    const completion = await client.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: "Hello" }],
      model: "deepseek-chat",
    });

    console.log('Success!');
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
