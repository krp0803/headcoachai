import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export interface PracticeDetails {
  sport: string
  duration: string
  playerCount: string
  ageGroup: string
  skillLevel: string
  focus: string
  selectedDrills?: string[]
}

// Create OpenAI instance with API key
const getOpenAIInstance = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file.')
  }

  return createOpenAI({
    apiKey: apiKey,
  })
}

export async function generatePracticePlan(details: PracticeDetails): Promise<string> {
  const prompt = `Create a detailed youth sports practice plan with the following requirements:

Sport: ${details.sport}
Duration: ${details.duration} minutes
Number of Players: ${details.playerCount}
Age Group: ${details.ageGroup}
Skill Level: ${details.skillLevel}
Focus Areas: ${details.focus}
${details.selectedDrills?.length ? `Include these drills: ${details.selectedDrills.join(', ')}` : ''}

Please provide:
1. A structured practice timeline with specific time allocations
2. Age-appropriate drills and activities
3. Safety considerations for youth athletes
4. Equipment needed
5. Coaching tips for each activity
6. Modifications for different skill levels within the group

Format the response as a clear, actionable practice plan that a youth coach can easily follow.`

  const systemPrompt = `You are an expert youth sports coach with 20+ years of experience specializing in ages 6-18. Your responses must:

SAFETY FIRST:
- Always include age-appropriate warm-up/cool-down
- Mention injury prevention for every drill
- Adjust intensity based on age group
- Include hydration reminders

DEVELOPMENT FOCUS:
- Prioritize fun and engagement over competition
- Use positive reinforcement language
- Include skill progression pathways
- Adapt for different learning styles

AGE-SPECIFIC GUIDELINES:
- U8: 15-20 min attention spans, basic skills, lots of movement
- U10-U12: 20-30 min activities, introduce tactics
- U14+: Longer drills, complex strategies, fitness components

STRUCTURE:
- Always provide time allocations
- List required equipment
- Include coaching tips for each activity
- Suggest modifications for different skill levels`

  try {
    const openai = getOpenAIInstance()

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: prompt,
      maxTokens: 1500,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error('Error generating practice plan:', error)
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Invalid API key. Please check your OpenAI API key.')
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.')
      }
      if (error.message.includes('insufficient_quota')) {
        throw new Error('OpenAI quota exceeded. Please check your billing.')
      }
      if (error.message.includes('model')) {
        throw new Error('Model not available. Please try again.')
      }
    }
    
    throw new Error(`Failed to generate practice plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function generateDrillVariations(drillName: string, ageGroup: string, skillLevel: string): Promise<string> {
  try {
    const openai = getOpenAIInstance()

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: 'You are a youth sports coach expert. Create drill variations that are safe and age-appropriate.',
      prompt: `Create 3 variations of the "${drillName}" drill for ${ageGroup} players at ${skillLevel} skill level. Include safety notes and equipment needed.`,
      maxTokens: 500,
    })
    
    return text
  } catch (error) {
    console.error('Error generating drill variations:', error)
    throw new Error('Failed to generate drill variations. Please try again.')
  }
}

export async function generateSafetyTips(sport: string, ageGroup: string): Promise<string> {
  try {
    const openai = getOpenAIInstance()

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: 'You are a youth sports safety expert.',
      prompt: `Provide 5 essential safety tips for coaching ${sport} to ${ageGroup} players. Focus on injury prevention and age-appropriate guidelines.`,
      maxTokens: 400,
    })
    
    return text
  } catch (error) {
    console.error('Error generating safety tips:', error)
    throw new Error('Failed to generate safety tips. Please try again.')
  }
}