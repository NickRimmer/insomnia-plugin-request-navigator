import { InsomniaDocBase } from '../insomnia/types'

export const getRequestMethodName = (requestInfo: InsomniaDocBase) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let method = (requestInfo as any).method
  if (!method) {
    if (requestInfo.type === 'GrpcRequest') method = 'gRPC'
    else method = 'N/A'
  }

  return method
}
