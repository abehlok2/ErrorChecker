import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { SystemMessage, BaseMessage } from 'langchain/schema'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain, ConversationChain } from 'langchain/chains'
import {BufferWindowMemory} from 'langchain/memory'

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
//create error checker specialist for specific languages?

class ErrorChecker {
    code;
    error;
    constructor(code: string, error: string) {
        this.code = code;
        this.error = error;
    }

    _userError() {
        let error = prompt('Please copy-paste your error message here: \n>')
        return error;
    }
    _userCode() {
        let code = prompt('Please copy-paste your code snippet here: \n>')
        return code;
    }


    quickCheck() {
        console.log("Welcome to Quick Check, it's worth a shot!")
        try {
            let error = this._userError();
            let code = this._userCode();
            let inputs = {error: error, code: code}

            let output = llmChain.stream({inputs})
            console.log(output);
            
        } catch {
            console.log("Error in quick check, please try again")
        }
    }

    extensiveCheck() {

    }

}
