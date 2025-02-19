import ky, { KyResponse } from "ky";
import { ApiError } from "../types/api-errors.js";
import { handleError } from "../utils/logger.js";
import { Response } from "express";

export const api = ky.create({
  prefixUrl: process.env.PLOOMES_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const userKey = process.env.PLOOMES_API_USER_KEY
        request.headers.set("User-Key", `${userKey}`)
      }
    ],
    beforeError: [
      async error => {
        const { response } = error;

        if (!response.ok) {
          const apiError: ApiError = await response.json()
          const expressLikeResponse = adaptKyResponse(response)
          const errorMessage = handleError(expressLikeResponse, apiError.message || '', apiError.message || '')
          error.name = apiError.message || "Unkown error";
          error.message = `${errorMessage}`;
        }
        return error;
      }
    ]
  }
})

function adaptKyResponse(kyRes: KyResponse<unknown>): Partial<Response> {
  return {
    status: function (code: number) {
      return { ...this, statusCode: code } as Response
    },
    statusCode: kyRes.status,
  }
}