# summary_formatter.py
import textwrap
import spacy

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def format_news_summary(transcript, title, source=None):
    """
    Formats a news article for posting in Discord, adding readability improvements
    and structuring the content with a title and source.

    :param transcript: str, the full text of the news article.
    :param title: str, the title of the news article.
    :param source: str, the source or URL of the news article (optional).
    :return: str, the formatted news article for Discord.
    """
    doc = nlp(transcript)
    paragraphs = []
    paragraph = ""
    for sent in doc.sents:
        if should_start_new_paragraph(paragraph, sent):
            if paragraph:  # Add the completed paragraph to the list
                paragraphs.append(paragraph.strip())
                paragraph = ""
            paragraph += sent.text + " "
        else:
            paragraph += sent.text + " "
    if paragraph:  # Add any remaining text as the last paragraph
        paragraphs.append(paragraph.strip())

    # Format paragraphs for Discord, slightly adjusting the width for better fit
    formatted_paragraphs = [textwrap.fill(p, width=70) for p in paragraphs]

    # Construct the header with the title and optionally include the source
    header = f"**{title}**\n"
    if source:
        header += f"Source: {source}\n\n"
    else:
        header += "\n"

    return header + "\n\n".join(formatted_paragraphs)

def should_start_new_paragraph(current_paragraph, sentence):
    # Heuristic for starting a new paragraph
    if len(current_paragraph.split()) > 40:  # Adjusted for Discord's format
        return True

    # Simple checks for starting a new paragraph
    sentence_words = sentence.text.split()
    if not sentence_words:
        return False
    if sentence.text[0].isupper() and len(current_paragraph.split()) > 15:  # Start with a capital letter and minimum length
        return True

    return False

# Example usage (commented out, as this would be called from elsewhere)
# summary = "Your long news article summary goes here."
# print(format_news_summary(summary))
