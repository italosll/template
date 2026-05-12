export interface SnackbarMessageInterface {
  snackbarMessage: string;
}


export const SNACKBAR_MESSAGE_SUCCESS_WHEN_CREATE :SnackbarMessageInterface= { snackbarMessage:"Cadastrado com sucesso!"}
export const SNACKBAR_MESSAGE_SUCCESS_WHEN_UPDATE :SnackbarMessageInterface= { snackbarMessage:"Atualizado com sucesso!"}
export const SNACKBAR_MESSAGE_SUCCESS_WHEN_DELETE:SnackbarMessageInterface= { snackbarMessage:"Deletado com sucesso!"}

export const SNACKBAR_MESSAGE_ERROR_WHEN_CREATE :SnackbarMessageInterface= { snackbarMessage:"Erro ao cadastrar!"}
export const SNACKBAR_MESSAGE_ERROR_WHEN_UPDATE :SnackbarMessageInterface= { snackbarMessage:"Erro ao atualizar!"}
export const SNACKBAR_MESSAGE_ERROR_WHEN_DELETE:SnackbarMessageInterface= { snackbarMessage:"Erro ao deletar!"}
