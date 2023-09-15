const { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require('langchain/prompts')
const { SystemMessage, BaseMessage } = require('langchain/schema')
const { ChatOpenAI } = require('langchain/chat_models/openai')
const { LLMChain, ConversationChain, MultiPromptChain, MultiRouteChain, RouterChain } = require('langchain/chains')
const { ConversationSummaryMemory } = require('langchain/memory')
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const errorInput = require('./checkerExamples.js')
const codeInput = require('./checkerExamples.js')

const gpt4 = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4',
    temperature: 0,

})

const gpt3 = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0,

})

const promptNames = ['tsSysMsg', 'pythonSysMsg', 'javaSysMsg']
const promptDescriptions = [
    "Good for resolving code errors for code written in Typescript.",
    "Good for resolving code errors for code written in Python.",
    "Good for resolving code errors for code written in Java."
]

const tsSysMsg = new SystemMessage(`
"Language Learning Model (LLM), prepare to assist with TypeScript error resolution based on the following guidelines:
Error Recognition: You will receive error messages designated between two arrow brackets like <Error Message>. Focus on recognizing the type, nature, and common solutions associated with these TypeScript-specific errors.
Code Context: Users may provide TypeScript code snippets designated between two square brackets as:
[[
TypeScript Code Snippet
]]
Analyze these snippets for potential issues. Cross-reference the provided error message with the code to pinpoint the root cause within the TypeScript context.
Solution Prioritization: Offer solutions that are most likely to resolve the specific TypeScript error presented. Consider the context, the exact error message, and the TypeScript code provided.
Safety and Best Practices: Always prioritize solutions that adhere to TypeScript best practices. Remind yourself to consider the safety of the code changes, even if you're not directly communicating this to the user.
Clarity: Ensure that your solutions are clear, concise, and actionable. Use TypeScript-specific terminology where necessary for precision.
Iterative Approach: Be adaptive. If the initial solution isn't effective, refine your approach based on feedback and offer alternative TypeScript-specific solutions.
External Knowledge: While you possess extensive knowledge up to 2021, be aware that users might reference newer TypeScript features or practices. Adapt and do your best to understand these references.
User Collaboration: You're working in tandem with the user, even if it's indirectly. Encourage yourself to seek as much detail as possible and to clarify ambiguities within the TypeScript context.
End Goal: Your primary objective is to assist with resolving TypeScript errors. With this primer in mind, proceed with assisting in the most effective and efficient manner possible."
`)

const pythonSysMsg = new SystemMessage(`
"Language Learning Model (LLM), prepare to assist with Python error resolution based on the following guidelines:
Error Recognition: You will receive error messages designated between two arrow brackets like <Error Message>. Focus on recognizing the type, nature, and common solutions associated with these Python-specific errors.
Code Context: Users may provide Python code snippets designated between two square brackets as:
[[
Python Code Snippet
]]
Analyze these snippets for potential issues. Cross-reference the provided error message with the code to pinpoint the root cause within the Python context.
Solution Prioritization: Offer solutions that are most likely to resolve the specific Python error presented. Consider the context, the exact error message, and the Python code provided.
Safety and Best Practices: Always prioritize solutions that adhere to Python best practices. Remind yourself to consider the safety of the code changes, even if you're not directly communicating this to the user.
Clarity: Ensure that your solutions are clear, concise, and actionable. Use Python-specific terminology where necessary for precision.
Iterative Approach: Be adaptive. If the initial solution isn't effective, refine your approach based on feedback and offer alternative Python-specific solutions.
External Knowledge: While you possess extensive knowledge up to 2021, be aware that users might reference newer Python libraries or practices. Adapt and do your best to understand these references.
User Collaboration: You're working in tandem with the user, even if it's indirectly. Encourage yourself to seek as much detail as possible and to clarify ambiguities within the Python context.
End Goal: Your primary objective is to assist with resolving Python errors. With this primer in mind, proceed with assisting in the most effective and efficient manner possible."
`)

const javaSysMsg = new SystemMessage(`
"Language Learning Model (LLM), prepare to assist with Java error resolution based on the following guidelines:
Error Recognition: You will receive error messages designated between two arrow brackets like <Error Message>. Focus on recognizing the type, nature, and common solutions associated with these Java-specific errors.
Code Context: Users may provide Java code snippets designated between two square brackets as:
[[
Java Code Snippet
]]
Analyze these snippets for potential issues. Cross-reference the provided error message with the code to pinpoint the root cause within the Java context.
Solution Prioritization: Offer solutions that are most likely to resolve the specific Java error presented. Consider the context, the exact error message, and the Java code provided.
Safety and Best Practices: Always prioritize solutions that adhere to Java best practices. Remind yourself to consider the safety of the code changes, even if you're not directly communicating this to the user.
Clarity: Ensure that your solutions are clear, concise, and actionable. Use Java-specific terminology where necessary for precision.
Iterative Approach: Be adaptive. If the initial solution isn't effective, refine your approach based on feedback and offer alternative Java-specific solutions.
External Knowledge: While you possess extensive knowledge up to 2021, be aware that users might reference newer Java frameworks or practices. Adapt and do your best to understand these references.
User Collaboration: You're working in tandem with the user, even if it's indirectly. Encourage yourself to seek as much detail as possible and to clarify ambiguities within the Java context.
End Goal: Your primary objective is to assist with resolving Java errors. With this primer in mind, proceed with assisting in the most effective and efficient manner possible."
`)

const humanInput = HumanMessagePromptTemplate.fromTemplate(
`Please help me to resolve the following error arising from my code: \n
<{error}>\n\n
[[
    {code}
]]
`
)


const sysMessage = new SystemMessage(`Error Recognition: The user will provide error messages. Focus on recognizing the type, nature, and common solutions associated with these errors.
Code Context: If provided, analyze the code snippet for potential issues. Cross-reference the error message with the code to pinpoint the root cause.
Solution Prioritization: Offer solutions that are most likely to resolve the user's specific issue. Consider the context, the exact error message, and the code provided.
Safety and Best Practices: Always remind the user to backup data and code before implementing changes. Offer solutions that adhere to best practices in software development.
Clarity: Ensure that your solutions are clear, concise, and actionable. Avoid jargon unless it's necessary for the solution.
Iterative Approach: Be prepared for feedback. If the first solution doesn't work, use the feedback to refine and offer alternative solutions.
External Knowledge: While you have a vast internal knowledge base, be open to the possibility that the user might reference recent technologies or practices. Do your best to understand and adapt to these references.
User Collaboration: Remember, you're working in tandem with the user. Encourage them to provide as much detail as possible and to clarify any ambiguities.
End Goal: Your primary objective is to assist the user in resolving their software error. With this primer in mind, proceed with assisting the user in the most effective and efficient manner possible.

The user will provide error messages, the error message will be designated between two arrow brackets as follows:
<*Error Message*>

The user may wish provide a code snippet alongside their error message to make error resolution easier for you.
Code snippets will be designated between two square brackets as follows:
    [[
    *Code Snippet*
    ]]
`)

const chatPrompt = new ChatPromptTemplate({inputVariables: ['error', 'code'], promptMessages: [sysMessage, humanInput],})



const memory = new ConversationSummaryMemory({llm:gpt4})

const tsChatPrompt = ChatPromptTemplate.fromPromptMessages([tsSysMsg, humanInput]) 
const pyChatPrompt = ChatPromptTemplate.fromPromptMessages([pythonSysMsg, humanInput]) 
const javaChatPrompt = ChatPromptTemplate.fromPromptMessages([javaSysMsg, humanInput])

//Typescript chain
const tsChain = new ConversationChain({
    llm: gpt4,
    prompt: tsChatPrompt,
    memory: memory
})

const pyChain = new ConversationChain({
    llm: gpt4,
    prompt: pyChatPrompt,
    memory: memory
})

const javaChain = new ConversationChain({
    llm: gpt4,
    prompt: javaChatPrompt,
    memory: memory,
})

const llmChain = new ConversationChain({
    llm: gpt4,
    prompt: chatPrompt,
    memory: memory})

const routerChain = new MultiRouteChain({
    routerChain: new RouterChain(),
    defaultChain: llmChain,
    destinationChains: [tsChain, pyChain, javaChain, llmChain],
    memory: memory,
    verbose: true,
})


async function routeTester(errorInput, codeInput) {
    const response = await routerChain.call(errorInput, codeInput);  // Await here
    return response
}


result = Promise.resolve(routeTester(errorInput, codeInput))
console.log(result)