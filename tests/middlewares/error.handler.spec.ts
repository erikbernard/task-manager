import { Request, Response, NextFunction } from "express";
import {
  errorHandler,
  AppError,
} from "../../src/shared/middlewares/error.handler";
import { ZodError, ZodIssue } from "zod";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = {};
    mockResponse = {
      status: responseStatus,
    };
  });

  it("deve lidar com um AppError e retornar o status code e a mensagem corretos", () => {
    const error = new AppError("Usuário não encontrado.", 404);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(404);
    expect(responseJson).toHaveBeenCalledWith({
      status: "error",
      message: "Usuário não encontrado.",
    });
  });

  it("deve lidar com um ZodError e retornar 400 com os detalhes dos erros", () => {
    const zodIssues: ZodIssue[] = [
      {
        code: "invalid_type",
        expected: "string",
        path: ["name"],
        message: "Required",
      },
    ];
    const error = new ZodError(zodIssues);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(400);
    expect(responseJson).toHaveBeenCalledWith({
      status: "error",
      message: "Dados inválidos.",
      issues: error.flatten().fieldErrors,
    });
  });

  it("deve lidar com um erro genérico e retornar 500", () => {
    const error = new Error("Algo inesperado aconteceu");

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({
      status: "error",
      message: "Erro interno do servidor.",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    consoleErrorSpy.mockRestore();
  });
});
