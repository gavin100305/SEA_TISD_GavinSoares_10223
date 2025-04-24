# mentor/utils/github_utils.py
import requests
from urllib.parse import urlparse
from django.conf import settings
from datetime import datetime
import json

def fetch_github_stats(project):
    if not project.github_link:
        return None
    
    try:
        # Parse GitHub URL more robustly
        parsed = urlparse(project.github_link)
        if not parsed.netloc.endswith('github.com'):
            return None
            
        path_parts = parsed.path.strip('/').split('/')
        if len(path_parts) < 2:
            return None
            
        owner, repo = path_parts[0], path_parts[1]
        
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': f'token {settings.GITHUB_API_TOKEN}'
        }
        base_url = f"https://api.github.com/repos/{owner}/{repo}"
        
        # Get basic repo info
        repo_info = requests.get(base_url, headers=headers, timeout=10).json()
        if 'message' in repo_info:  # GitHub API error
            print(f"GitHub API Error: {repo_info['message']}")
            return None
        
        # Get contributors
        contributors = requests.get(
            f"{base_url}/contributors?per_page=100", 
            headers=headers,
            timeout=10
        ).json()
        contributor_stats = {c['login']: c['contributions'] for c in contributors}
        
        # Get languages
        languages = requests.get(
            f"{base_url}/languages",
            headers=headers,
            timeout=10
        ).json()
        total_bytes = sum(languages.values())
        languages_percent = {
            lang: round((bytes/total_bytes)*100, 1) 
            for lang, bytes in languages.items()
        } if total_bytes > 0 else {}
        
        # Get latest commit
        commits = requests.get(
            f"{base_url}/commits?per_page=1",
            headers=headers,
            timeout=10
        ).json()
        latest_commit = commits[0] if commits else None
        
        return {
            'stars': repo_info.get('stargazers_count', 0),
            'forks': repo_info.get('forks_count', 0),
            'watchers': repo_info.get('subscribers_count', 0),
            'contributors': contributor_stats,
            'languages': languages_percent,
        }
        
    except Exception as e:
        print(f"Error fetching GitHub stats: {str(e)}")
        return None