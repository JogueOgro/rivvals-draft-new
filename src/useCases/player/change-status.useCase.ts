import { IChangeStatusParams, IUseCaseParams } from '@/domain/base.domain';
import { AllowanceService } from '@/services/allowance.service';

const execute = async (params: IUseCaseParams & IChangeStatusParams) => {
  const { id, status, successCallBack, errorCallBack } = params;
  AllowanceService.changeStatus({
    id,
    status,
  })
    .then(() => {
      successCallBack();
    })
    .catch(() => {
      errorCallBack();
    });
};

export const changeAllowanceStatus = { execute };
