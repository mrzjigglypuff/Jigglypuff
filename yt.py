from yt_dlp import YoutubeDL

responseNum = 10

def topResult(query):
  response = []
  print(f"Searching for {query} -queryInfo")
  ydl_info = {
    'quiet': True,
    'extract_flat': True,
    'force_generic_extractor': False,
  }
  try:
    with YoutubeDL(ydl_info) as ydl:
      info = ydl.extract_info(f"ytsearch{responseNum}:{query}", download=False)
      if 'entries' in info:
        response = info['entries']
      else:
        return [info]  # wrap single result
  except Exception as e:
    return [{"error": str(e)}]
  return response

def getStreamUrl(query):
  ydl_opts = {
    'quiet': True,
    'format': "m4a/bestaudio/best"
  }

  try:
    with YoutubeDL(ydl_opts) as ydl:
      # Handle search query or direct link
      if query.startswith("ytsearch"):
        info = ydl.extract_info(query, download=False)
        if 'entries' in info:
          info = info['entries'][0]
      else:
        info = ydl.extract_info(query, download=False)

      return [{
        'title': info.get('title'),
        'url': info.get('url'),
        'duration': info.get('duration'),
        'uploader': info.get('uploader'),
        'webpage_url': info.get('webpage_url'),
        'thumbnail': info.get('thumbnail')
      }]
  except Exception as e:
    return [{"error": f"Failed to fetch stream: {str(e)}"}]
