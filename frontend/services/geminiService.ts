import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const fetchKurdishContent = async (categoryTitle: string): Promise<{title: string, text: string, sourceUrls: string[]}[]> => {
  let extraInstruction = "";
  
  if (categoryTitle === 'یاریە کوردەواریەکان') {
    extraInstruction = "Search for a mix of traditional physical Kurdish games and classic pen-and-paper games (یاری سەر وەرەقە و قەڵەم). Must be authentic Kurdish.";
  } else if (categoryTitle === 'نوکتە') {
    extraInstruction = "CRITICAL: Search for real, popular, and authentic jokes told by Kurdish people. DO NOT invent them.";
  } else if (categoryTitle === 'مەتەڵ') {
    extraInstruction = "CRITICAL: Search for real, traditional Kurdish riddles (مەتەڵی فۆلکلۆری کوردی). You MUST include the answer (وەڵام) along with the riddle. For TITLE, write a short name or just 'مەتەڵ'. For TEXT, write the riddle and the answer clearly, like 'مەتەڵ: [riddle text]\nوەڵام: [answer]'. Do not include the word 'TEXT:' inside the actual content.";
  } else if (categoryTitle === 'شعر') {
    extraInstruction = "ABSOLUTELY CRITICAL: Search for EXACT, word-for-word authentic poems by famous Kurdish poets (e.g., Nali, Mahwi, Piramerd, Sherko Bekas). The poem MUST be short, only 1 or 2 stanzas (یەک دوو کۆپلە). Try to source them from Kurdish poetry Facebook pages or social media if possible. DO NOT generate new poetry. You MUST include the poet's name in the title.";
  } else if (categoryTitle === 'چیرۆک') {
    extraInstruction = "CRITICAL: Search for real, existing traditional Kurdish folktales (چیرۆکی فۆلکلۆری کوردی) or well-known stories.";
  } else if (categoryTitle === 'قسەی نەستەق و پەندی پێشینان') {
    extraInstruction = "CRITICAL: Search for complete Kurdish proverbs or quotes. Do not leave them half-finished.";
  } else if (categoryTitle === 'خواردنە کوردەواریەکان') {
    extraInstruction = "CRITICAL: Describe authentic traditional Kurdish foods. For this category, it is OKAY if you don't have exact sources or formal titles. Just provide accurate descriptions of real Kurdish dishes.";
  } else if (categoryTitle === 'کوردی پەتی') {
    extraInstruction = "CRITICAL: Search for 'Pure Kurdish' (کوردی پەتی) words. Keep the format very simple and clean. TITLE must be the Pure Kurdish word itself. TEXT must be exactly like this:\nوشەی باو: [The common borrowed word]\nواتا: [Short meaning or explanation].";
  } else if (categoryTitle === 'شوێنە گەشتیاریەکان') {
    extraInstruction = "CRITICAL: Search for real, famous tourist attractions or nature spots in Kurdistan. TITLE must be the exact name of the place. TEXT MUST ONLY contain the location (Province and District/Sub-district). DO NOT provide any other descriptions.";
  }

  const prompt = `You are an expert in Kurdish culture. You MUST use Google Search to find 3 EXACT, authentic, and real items for the category: "${categoryTitle}".
${extraInstruction}
The content MUST be entirely in the Kurdish language (Sorani dialect).
Do not invent anything (unless describing traditional foods). Copy the exact text from real Kurdish websites, books, or forums.

Format your response EXACTLY like this for each of the 3 items. Do not use markdown code blocks for the whole response, just plain text with these exact markers:

###ITEM###
TITLE: [The title or name here. Leave blank if not applicable]
TEXT: [The exact content here. If it is a poem, preserve the exact verses and line breaks]
###END_ITEM###
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more factual retrieval
      }
    });

    const text = response.text || "";
    const items: {title: string, text: string, sourceUrls: string[]}[] = [];
    
    // Extract grounding URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls: string[] = [];
    for (const chunk of chunks as any[]) {
      if (chunk.web?.uri) {
        urls.push(chunk.web.uri);
      }
    }
    const uniqueUrls = [...new Set(urls)];
    
    // Only keep sources for Poetry and Proverbs
    const shouldKeepSources = categoryTitle === 'شعر' || categoryTitle === 'قسەی نەستەق و پەندی پێشینان';
    const finalUrls = shouldKeepSources ? uniqueUrls : [];

    // Parse the custom formatted text
    const itemBlocks = text.split('###ITEM###').slice(1);
    
    for (const block of itemBlocks) {
      const endIdx = block.indexOf('###END_ITEM###');
      if (endIdx === -1) continue;
      const content = block.substring(0, endIdx).trim();
      
      // Use case-insensitive matching to prevent 'Text:' or 'text:' from leaking
      const titleMatch = content.match(/TITLE:\s*(.*)/i);
      const textMatch = content.match(/TEXT:\s*([\s\S]*)/i);
      
      if (textMatch) {
        items.push({
          title: titleMatch ? titleMatch[1].trim() : '',
          text: textMatch[1].trim(),
          sourceUrls: finalUrls
        });
      }
    }

    // Fallback if parsing fails but we have text (e.g. model ignored formatting)
    if (items.length === 0 && text.length > 0) {
       items.push({
         title: categoryTitle === 'خواردنە کوردەواریەکان' ? '' : `بابەتی دۆزراوە بۆ ${categoryTitle}`,
         text: text.replace(/###ITEM###|###END_ITEM###|TITLE:|TEXT:/gi, '').trim(),
         sourceUrls: finalUrls
       });
    }

    return items;
  } catch (error) {
    console.error("Error fetching from Gemini:", error);
    throw error;
  }
};