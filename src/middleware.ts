import { apiMiddleware } from '@/middlewares/apiMiddleware'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { chain } from '@/middlewares/chain'

const middlewares = [apiMiddleware, authMiddleware]
export default chain(middlewares)

export const config = { matcher: ['/((?!_next|favicon.*).*)'] }
