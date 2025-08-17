import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../src/shared/middlewares/auth.middleware";
import { AuthenticatedRequest } from "../../src/shared/interfaces/IAuthenticatedRequest";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: responseStatus,
    };
  });

  it("deve chamar next() e adicionar userId ao request com um token válido", () => {
    const token = "valid.token.here";
    const decodedPayload = { id: "user-123" };
    mockRequest.headers = { authorization: `Bearer ${token}` };

    (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect((mockRequest as unknown as AuthenticatedRequest).userId).toBe("user-123");
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it("deve retornar 401 se o header de autorização não for fornecido", () => {
    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      message: "Token não fornecido.",
    });
  });

  it("deve retornar 401 se o token for inválido ou malformado", () => {
    const token = "invalid.token";
    mockRequest.headers = { authorization: `Bearer ${token}` };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({ message: "Token inválido." });
  });

  it("deve retornar 401 se o header de autorização não estiver no formato Bearer", () => {
    mockRequest.headers = { authorization: "InvalidFormat" };

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({ message: "Token inválido." });
  });
});
