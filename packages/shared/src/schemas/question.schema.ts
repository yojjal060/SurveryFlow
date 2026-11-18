import { z } from "zod";

export const questionSchema = z.record(z.string(), z.never());
