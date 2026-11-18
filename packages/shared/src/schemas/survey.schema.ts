import { z } from "zod";

export const surveySchema = z.record(z.string(), z.never());
