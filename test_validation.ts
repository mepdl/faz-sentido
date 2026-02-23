import { insertPostSchema } from "./shared/schema";
import { z } from "zod";

const updateSchema = insertPostSchema.partial();

// Simulando os dados que o formulário enviaria
const postData = {
    title: "O Desajuste Moderno: Como Alinhar sua Biologia com a Longevidade",
    slug: "o-desajuste-moderno-como-alinhar-sua-biologia-com-a-longevidade",
    content: "CONTEUDO...",
    categoryId: "bd928d80-27f2-4d62-9ee4-19550d6d94af", // UUID String
    readTime: 5, // Number
    status: "published",
    authorName: "Marcos",
    isFeatured: false,
    excerpt: "..."
};

console.log("Testing validation with typical data...");
try {
    const result = updateSchema.parse(postData);
    console.log("Validation passed!", result);
} catch (e: any) {
    if (e instanceof z.ZodError) {
        console.error("Validation failed with ZodError:");
        console.error(JSON.stringify(e.errors, null, 2));
    } else {
        console.error("Unknown error:", e);
    }
}
