import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

app.post('/api/ask', async (c) => {
  try {
    const body = await c.req.parseBody()
    const image = body['image'] as File
    const question = body['question'] as string

    if (!image || !question) {
      return c.json({ error: 'Missing image or question' }, 400)
    }

    // Here, you would typically:
    // 1. Process the image (e.g., resize, convert)
    // 2. Send the image and question to an AI service
    // 3. Get the response and send it back

    // For now, we'll just echo back a mock response
    const mockDescription = `This is a mock description for the image. The question was: "${question}"`

    return c.json({ description: mockDescription })
  } catch (error) {
    console.error('Error processing request:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app