export interface BaseDomain {
  id?: string
  createdAt?: string;
}

export interface IUseCaseParams {
  successCallBack: () => void
  errorCallBack: () => void
}