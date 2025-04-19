import os
import json
import requests
from django.conf import settings

def generate_gemini_recommendations(expertise, projects_data):
    """
    Use Gemini API to generate intelligent project recommendations based on expertise.
    
    Args:
        expertise (str): The collaborator's expertise
        projects_data (list): List of projects with their details
        
    Returns:
        dict: Dictionary of project IDs with their relevance scores
    """
    try:
        # api_key = settings.GEMINI_API_KEY
        api_key = settings.GEMINI_API_KEY
        api_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"
        
        # Format the expertise and project data for the prompt
        prompt = f"""
        As an AI assistant, analyze the compatibility between a collaborator's expertise 
        and various projects. The collaborator's expertise is: "{expertise}".
        
        Here's a list of projects with their details:
        {json.dumps(projects_data)}
        
        For each project, provide:
        1. A relevance score from 0-100 (where 100 is perfect match)
        2. A short explanation of why this project matches the expertise
        
        Return your analysis as a JSON object with the following structure:
        {{
            "project_id1": {{"score": 85, "explanation": "Reason for match"}},
            "project_id2": {{"score": 70, "explanation": "Reason for match"}},
            ...
        }}
        
        Focus on semantic relationships, not just exact keyword matches. For example, if expertise is "Python" 
        and a project involves "AI/ML", recognize that Python is commonly used in AI/ML and score accordingly.
        """
        
        # Prepare the API request
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        # Make the API request
        response = requests.post(api_url, headers=headers, json=payload)
        
        if response.status_code == 200:
            response_data = response.json()
            generated_text = response_data['candidates'][0]['content']['parts'][0]['text']
            
            # Extract the JSON part from the response
            json_start = generated_text.find('{')
            json_end = generated_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = generated_text[json_start:json_end]
                recommendations = json.loads(json_str)
                return recommendations
            else:
                # Fallback if JSON extraction fails
                return {}
        else:
            print(f"Gemini API error: {response.status_code}, {response.text}")
            return {}
            
    except Exception as e:
        print(f"Error in Gemini recommendation: {str(e)}")
        return {}
