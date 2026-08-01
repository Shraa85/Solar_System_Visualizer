from flask import Flask, render_template, request, jsonify, session, redirect, url_for, abort
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import json
from datetime import datetime, timedelta
from functools import wraps
from quiz_data import QUIZ_BANK
import random
import urllib.request
import urllib.parse

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'

DATABASE = 'solar_system.db'

PLANET_DETAILS = {
    'mercury': {
        'name': 'Mercury',
        'tagline': 'The smallest and fastest planet in our solar system',
        'image': 'planet_images/mercury.jpg',
        'accent_color': '#c8a96d',
        'quick_stats': {
            'Planet Order': '1st from the Sun',
            'Diameter': '4,879 km',
            'Length of Day': '58.6 Earth days',
            'Length of Year': '88 Earth days',
            'Moons': '0',
            'Type': 'Rocky planet'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Mercury is the closest planet to the Sun and the smallest major planet in the solar system.',
                    'It is a rocky world with a large metallic core, which makes it unusually dense for its size.',
                    'Because Mercury has almost no atmosphere, heat does not stay trapped around the planet for long.',
                    'This causes extremely hot days and extremely cold nights.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Mercury has been known since ancient times because it can be seen without a telescope.',
                    'Many early civilizations observed it, though it is often difficult to spot because it stays close to the Sun in the sky.',
                    'Modern understanding of Mercury improved a lot through space missions such as Mariner 10 and MESSENGER.',
                    'These missions helped scientists study its cratered surface, magnetic field, and internal structure.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 57.9 million km.',
                    'Diameter: about 4,879 km.',
                    'Surface temperature range: roughly -173°C at night to 427°C during the day.',
                    'Gravity: about 38% of Earth’s gravity.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Mercury has a heavily cratered surface that looks somewhat similar to the Moon.',
                    'It has cliffs called scarps that formed as the planet slowly cooled and shrank.',
                    'Mercury rotates slowly on its axis but revolves quickly around the Sun.',
                    'A year on Mercury is shorter than a day on Mercury.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'Mercury is the fastest planet in the solar system.',
                    'Sunrise on Mercury would look very strange because of its slow rotation and fast orbit.',
                    'Despite being closest to the Sun, Mercury is not the hottest planet; Venus is hotter.',
                    'Mercury has no rings and no moons.'
                ]
            }
        ]
    },
    'venus': {
        'name': 'Venus',
        'tagline': 'The hottest planet with a thick, toxic atmosphere',
        'image': 'planet_images/venus.jpg',
        'accent_color': '#f4c16a',
        'quick_stats': {
            'Planet Order': '2nd from the Sun',
            'Diameter': '12,104 km',
            'Length of Day': '243 Earth days',
            'Length of Year': '225 Earth days',
            'Moons': '0',
            'Type': 'Rocky planet'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Venus is often called Earth’s twin because the two planets are similar in size.',
                    'However, Venus is extremely hostile because of its thick carbon dioxide atmosphere and crushing pressure.',
                    'Its powerful greenhouse effect traps heat very efficiently.',
                    'That makes Venus the hottest planet in the solar system.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Venus has been observed since ancient times and was important in the astronomy of many early cultures.',
                    'Because it is very bright, it is often called the Morning Star or Evening Star.',
                    'Spacecraft missions revealed that the planet is hidden beneath thick clouds.',
                    'Radar mapping helped scientists learn about its mountains, plains, and volcanoes.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 108.2 million km.',
                    'Diameter: about 12,104 km.',
                    'Average surface temperature: around 465°C.',
                    'Surface pressure is far greater than Earth’s and is strong enough to crush many spacecraft.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Venus rotates very slowly and in the opposite direction compared to most planets.',
                    'Its thick clouds are made mostly of sulfuric acid.',
                    'The surface likely has many volcanic features.',
                    'Because of its dense atmosphere, sunlight is scattered strongly before reaching the ground.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'A day on Venus is longer than a year on Venus.',
                    'Venus is brighter than any planet seen from Earth.',
                    'It spins backward compared to most planets.',
                    'Venus is the hottest planet even though Mercury is closer to the Sun.'
                ]
            }
        ]
    },
    'earth': {
        'name': 'Earth',
        'tagline': 'Our home planet and the only known world with life',
        'image': 'planet_images/earth.jpg',
        'accent_color': '#5db5ff',
        'quick_stats': {
            'Planet Order': '3rd from the Sun',
            'Diameter': '12,742 km',
            'Length of Day': '24 hours',
            'Length of Year': '365.25 days',
            'Moons': '1',
            'Type': 'Rocky planet'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Earth is the only known planet that supports life.',
                    'Its liquid water, breathable atmosphere, moderate temperatures, and protective magnetic field help make life possible.',
                    'Earth is part of the habitable zone, where temperatures allow water to remain liquid.',
                    'Its systems of land, oceans, air, and living organisms interact continuously.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Humans have studied Earth for thousands of years, but modern science transformed our understanding of its shape, motion, and place in space.',
                    'Astronomy showed that Earth orbits the Sun rather than the Sun orbiting Earth.',
                    'Satellites and space missions gave us a global view of weather, climate, and geology.',
                    'Earth science continues to grow through observation, modeling, and exploration.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 149.6 million km.',
                    'Diameter: about 12,742 km.',
                    'Surface water covers about 71% of the planet.',
                    'Earth’s atmosphere is mainly nitrogen and oxygen.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Earth has one natural satellite: the Moon.',
                    'Its atmosphere helps regulate temperature and protects life from harmful radiation.',
                    'Plate tectonics slowly reshape the surface through earthquakes, volcanoes, and continental movement.',
                    'Earth rotates once each day and revolves around the Sun once each year.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'Earth is the densest planet in the solar system.',
                    'It is the only known world with stable liquid oceans on the surface.',
                    'The Moon helps influence ocean tides.',
                    'Earth is not a perfect sphere; it bulges slightly at the equator.'
                ]
            }
        ]
    },
    'mars': {
        'name': 'Mars',
        'tagline': 'The red planet and a major target for future exploration',
        'image': 'planet_images/mars.jpg',
        'accent_color': '#ff8a6b',
        'quick_stats': {
            'Planet Order': '4th from the Sun',
            'Diameter': '6,779 km',
            'Length of Day': '24.6 hours',
            'Length of Year': '687 Earth days',
            'Moons': '2',
            'Type': 'Rocky planet'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Mars is a cold, dry, rocky planet with a thin atmosphere.',
                    'Scientists are especially interested in Mars because it may once have had more liquid water on its surface.',
                    'Its environment offers clues about planetary evolution and the search for past life.',
                    'Mars is one of the most explored planets after Earth.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Mars has been observed since ancient times and has long inspired myths and stories.',
                    'Telescopic observations made it one of the most studied planets.',
                    'Modern missions such as orbiters, landers, and rovers transformed our knowledge of Mars.',
                    'Rovers have explored rocks, soil, weather, and signs of ancient water.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 227.9 million km.',
                    'Diameter: about 6,779 km.',
                    'Average temperature is much colder than Earth’s.',
                    'Its atmosphere is mostly carbon dioxide and is very thin.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Mars has giant volcanoes, vast canyons, polar ice caps, and dust storms.',
                    'Olympus Mons is the tallest known volcano in the solar system.',
                    'Valles Marineris is one of the largest canyon systems in the solar system.',
                    'Mars has two small moons: Phobos and Deimos.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'A Martian day is very close to an Earth day.',
                    'Mars gets its red appearance from iron-rich dust.',
                    'It has both ancient river evidence and frozen water.',
                    'Mars is one of the strongest candidates for future human missions.'
                ]
            }
        ]
    },
    'jupiter': {
        'name': 'Jupiter',
        'tagline': 'The largest planet and king of the gas giants',
        'image': 'planet_images/jupiter.jpg',
        'accent_color': '#ddb06c',
        'quick_stats': {
            'Planet Order': '5th from the Sun',
            'Diameter': '139,820 km',
            'Length of Day': '9.9 hours',
            'Length of Year': '11.86 Earth years',
            'Moons': '95+',
            'Type': 'Gas giant'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Jupiter is the largest planet in the solar system and is made mostly of hydrogen and helium.',
                    'It likely has no solid surface like Earth.',
                    'Its huge gravity strongly influences nearby objects, moons, and even asteroid paths.',
                    'Jupiter helps scientists understand giant planet formation.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Jupiter has been known since ancient times because it is bright and easy to see in the night sky.',
                    'Galileo’s observations of its four large moons helped change astronomy forever.',
                    'Those observations supported the idea that not everything revolves around Earth.',
                    'Modern missions continue to study Jupiter’s atmosphere, magnetism, and moons.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 778.5 million km.',
                    'Diameter: about 139,820 km.',
                    'It is more than 11 times wider than Earth.',
                    'Its rapid rotation causes it to bulge at the equator.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Jupiter is famous for the Great Red Spot, a giant storm larger than Earth.',
                    'It has a very strong magnetic field.',
                    'Its atmosphere has colorful cloud bands caused by fast winds and complex chemistry.',
                    'Jupiter has many moons, including Europa, Ganymede, Io, and Callisto.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'Jupiter is so large that more than 1,300 Earths could fit inside it by volume.',
                    'It has the shortest day of all the planets.',
                    'Its moon Ganymede is the largest moon in the solar system.',
                    'Jupiter acts like a giant laboratory for studying storms and atmospheric motion.'
                ]
            }
        ]
    },
    'saturn': {
        'name': 'Saturn',
        'tagline': 'The ringed planet with spectacular beauty',
        'image': 'planet_images/saturn.jpg',
        'accent_color': '#f0d19d',
        'quick_stats': {
            'Planet Order': '6th from the Sun',
            'Diameter': '116,460 km',
            'Length of Day': '10.7 hours',
            'Length of Year': '29.46 Earth years',
            'Moons': '146+',
            'Type': 'Gas giant'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Saturn is a gas giant made mostly of hydrogen and helium.',
                    'It is most famous for its bright and extensive ring system.',
                    'These rings are made largely of ice particles with some rocky material mixed in.',
                    'Saturn helps scientists study both planetary atmospheres and ring dynamics.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Saturn has been known since ancient times and was visible to early skywatchers.',
                    'Telescopes later revealed that Saturn was surrounded by an unusual structure.',
                    'Over time, astronomers understood this structure as a system of rings.',
                    'Space missions provided stunning close-up views of the planet and its moons.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 1.43 billion km.',
                    'Diameter: about 116,460 km.',
                    'It is the second-largest planet in the solar system.',
                    'Its density is lower than water.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Saturn’s rings are thin compared to their huge width.',
                    'The planet has strong winds and layered clouds.',
                    'It has many moons, including Titan, which has a thick atmosphere.',
                    'Saturn rotates quickly, making it slightly flattened at the poles.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'Saturn could float in a giant ocean because of its low average density.',
                    'Its rings are not solid; they are made of countless particles.',
                    'Titan is one of the most fascinating moons in the solar system.',
                    'Saturn is often considered the most visually striking planet.'
                ]
            }
        ]
    },
    'uranus': {
        'name': 'Uranus',
        'tagline': 'The sideways ice giant with unusual seasons',
        'image': 'planet_images/uranus.jpg',
        'accent_color': '#88ecff',
        'quick_stats': {
            'Planet Order': '7th from the Sun',
            'Diameter': '50,724 km',
            'Length of Day': '17 hours',
            'Length of Year': '84 Earth years',
            'Moons': '27+',
            'Type': 'Ice giant'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Uranus is an ice giant made of hydrogen, helium, and icy materials such as water, ammonia, and methane.',
                    'Its most unusual feature is its extreme tilt.',
                    'It rotates almost on its side, which creates very unusual seasonal patterns.',
                    'This makes Uranus different from nearly every other major planet.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Uranus was the first planet discovered with a telescope in modern times.',
                    'Its discovery expanded the known size of the solar system.',
                    'Later observations revealed its moons, rings, and strange orientation.',
                    'Though less explored than some planets, it remains an important target for future study.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 2.87 billion km.',
                    'Diameter: about 50,724 km.',
                    'Its blue-green color is linked to methane in its atmosphere.',
                    'It is far colder than most places on Earth.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Uranus rotates at a very tilted angle, almost rolling around the Sun.',
                    'It has rings, though they are much fainter than Saturn’s.',
                    'Its atmosphere is cold, windy, and layered.',
                    'Uranus has many moons named after literary characters.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'A season on Uranus lasts about 21 Earth years.',
                    'It looks calm compared to Jupiter, but its atmosphere is still dynamic.',
                    'Its sideways tilt may have been caused by a giant impact long ago.',
                    'Uranus was once mistaken for a star before being recognized as a planet.'
                ]
            }
        ]
    },
    'neptune': {
        'name': 'Neptune',
        'tagline': 'The distant blue world with powerful winds',
        'image': 'planet_images/neptune.jpg',
        'accent_color': '#6e96ff',
        'quick_stats': {
            'Planet Order': '8th from the Sun',
            'Diameter': '49,244 km',
            'Length of Day': '16 hours',
            'Length of Year': '164.8 Earth years',
            'Moons': '14+',
            'Type': 'Ice giant'
        },
        'sections': [
            {
                'title': 'Theoretical Overview',
                'content': [
                    'Neptune is the farthest major planet from the Sun.',
                    'It is an ice giant with a deep blue appearance and an active atmosphere.',
                    'Despite its distance from the Sun, Neptune has some of the fastest winds in the solar system.',
                    'It is important for understanding outer planet weather and planetary structure.'
                ]
            },
            {
                'title': 'History',
                'content': [
                    'Neptune was discovered through mathematical prediction before it was directly observed.',
                    'Astronomers noticed that Uranus was not moving exactly as expected.',
                    'Calculations suggested another planet was affecting it gravitationally.',
                    'This became one of the greatest success stories of theoretical astronomy.'
                ]
            },
            {
                'title': 'Measurements',
                'content': [
                    'Average distance from the Sun: about 4.50 billion km.',
                    'Diameter: about 49,244 km.',
                    'Its atmosphere contains hydrogen, helium, and methane.',
                    'A year on Neptune lasts nearly 165 Earth years.'
                ]
            },
            {
                'title': 'Characteristics',
                'content': [
                    'Neptune has a dynamic atmosphere with storms and high-speed winds.',
                    'It has faint rings and several moons.',
                    'Its largest moon, Triton, is geologically interesting and orbits in an unusual way.',
                    'Neptune receives very little sunlight compared to Earth.'
                ]
            },
            {
                'title': 'Fun Facts',
                'content': [
                    'Neptune was discovered using math before direct visual confirmation.',
                    'Its winds can be faster than the speed of sound on Earth.',
                    'It is one of the coldest worlds in the solar system.',
                    'Because Neptune is so far away, only a very small amount of sunlight reaches it.'
                ]
            }
        ]
    }
}


def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS simulations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                simulation_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                quiz_id TEXT NOT NULL,
                quiz_name TEXT NOT NULL,
                score REAL NOT NULL,
                correct_answers INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,
                time_taken_seconds INTEGER NOT NULL,
                user_answers TEXT NOT NULL,
                result_details TEXT NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')

        db.commit()
        db.close()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def get_quiz_catalog():
    catalog = []
    for quiz_id, quiz in QUIZ_BANK.items():
        catalog.append({
            'id': quiz_id,
            'title': quiz['title'],
            'description': quiz['description'],
            'difficulty': quiz['difficulty'],
            'duration_minutes': quiz['duration_minutes'],
            'total_questions': quiz['total_questions']
        })
    return catalog


def get_public_quiz(quiz_id):
    quiz = QUIZ_BANK.get(quiz_id)
    if not quiz:
        return None

    return {
        'id': quiz_id,
        'title': quiz['title'],
        'description': quiz['description'],
        'difficulty': quiz['difficulty'],
        'duration_minutes': quiz['duration_minutes'],
        'total_questions': quiz['total_questions'],
        'questions': [
            {
                'number': index + 1,
                'question': question['question'],
                'options': question['options']
            }
            for index, question in enumerate(quiz['questions'])
        ]
    }


def calculate_streak(attempt_rows):
    if not attempt_rows:
        return 0

    distinct_days = {
        datetime.fromisoformat(row['completed_at']).date()
        for row in attempt_rows
    }

    streak = 0
    current_day = datetime.now().date()

    while current_day in distinct_days:
        streak += 1
        current_day -= timedelta(days=1)

    return streak


def build_result_details(quiz, submitted_answers):
    result_details = []
    correct_answers = 0

    for index, question in enumerate(quiz['questions']):
        chosen_index = submitted_answers[index] if index < len(submitted_answers) else None
        correct_index = question['answer']
        is_correct = chosen_index == correct_index

        if is_correct:
            correct_answers += 1

        chosen_option = None
        if isinstance(chosen_index, int) and 0 <= chosen_index < len(question['options']):
            chosen_option = question['options'][chosen_index]

        result_details.append({
            'number': index + 1,
            'question': question['question'],
            'options': question['options'],
            'correct_index': correct_index,
            'correct_option': question['options'][correct_index],
            'chosen_index': chosen_index,
            'chosen_option': chosen_option,
            'is_correct': is_correct
        })

    return result_details, correct_answers



# ==========================================================
#  YOUTUBE VIDEO SEARCH (free, no API key)
# ==========================================================

def search_youtube(query, max_results=3):
    try:
        import re
        encoded = urllib.parse.quote_plus(query + " for kids education solar system")
        url = f"https://www.youtube.com/results?search_query={encoded}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        video_ids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
        titles    = re.findall(r'"title":{"runs":\[{"text":"([^"]+)"', html)
        channels  = re.findall(r'"ownerText":{"runs":\[{"text":"([^"]+)"', html)

        seen, results = set(), []
        for i, vid_id in enumerate(video_ids):
            if vid_id in seen or len(results) >= max_results:
                break
            seen.add(vid_id)
            title   = titles[i]   if i < len(titles)   else "Watch on YouTube"
            channel = channels[i] if i < len(channels) else "YouTube"
            results.append({
                "title":     title,
                "url":       f"https://www.youtube.com/watch?v={vid_id}",
                "thumbnail": f"https://i.ytimg.com/vi/{vid_id}/mqdefault.jpg",
                "channel":   channel,
                "duration":  None
            })
        return results if results else _fallback_videos(query)
    except Exception:
        return _fallback_videos(query)


def _fallback_videos(query):
    FALLBACK = {
        "mercury": [{"title": "Mercury 101 | National Geographic", "url": "https://www.youtube.com/watch?v=0KBjnNuhRHs", "thumbnail": "https://i.ytimg.com/vi/0KBjnNuhRHs/mqdefault.jpg", "channel": "Nat Geo", "duration": "2:47"}],
        "venus":   [{"title": "Venus 101 | National Geographic", "url": "https://www.youtube.com/watch?v=BvXa1n9fjow", "thumbnail": "https://i.ytimg.com/vi/BvXa1n9fjow/mqdefault.jpg", "channel": "Nat Geo", "duration": "3:10"}],
        "earth":   [{"title": "Earth 101 | National Geographic", "url": "https://www.youtube.com/watch?v=HCDVN7DCzYE", "thumbnail": "https://i.ytimg.com/vi/HCDVN7DCzYE/mqdefault.jpg", "channel": "Nat Geo", "duration": "2:45"}],
        "mars":    [{"title": "Mars 101 | National Geographic", "url": "https://www.youtube.com/watch?v=D8pnmwOXhoY", "thumbnail": "https://i.ytimg.com/vi/D8pnmwOXhoY/mqdefault.jpg", "channel": "Nat Geo", "duration": "3:05"}],
        "jupiter": [{"title": "Jupiter 101 | National Geographic", "url": "https://www.youtube.com/watch?v=PtkqwslbLY8", "thumbnail": "https://i.ytimg.com/vi/PtkqwslbLY8/mqdefault.jpg", "channel": "Nat Geo", "duration": "2:55"}],
        "saturn":  [{"title": "Saturn 101 | National Geographic", "url": "https://www.youtube.com/watch?v=epZdZaEQhS0", "thumbnail": "https://i.ytimg.com/vi/epZdZaEQhS0/mqdefault.jpg", "channel": "Nat Geo", "duration": "3:22"}],
        "uranus":  [{"title": "Uranus 101 | National Geographic", "url": "https://www.youtube.com/watch?v=m4NXbFOiOGk", "thumbnail": "https://i.ytimg.com/vi/m4NXbFOiOGk/mqdefault.jpg", "channel": "Nat Geo", "duration": "2:49"}],
        "neptune": [{"title": "Neptune 101 | National Geographic", "url": "https://www.youtube.com/watch?v=NStn7zZKXfE", "thumbnail": "https://i.ytimg.com/vi/NStn7zZKXfE/mqdefault.jpg", "channel": "Nat Geo", "duration": "2:39"}],
        "default": [
            {"title": "The Solar System — our home in space", "url": "https://www.youtube.com/watch?v=libKVRa01L8", "thumbnail": "https://i.ytimg.com/vi/libKVRa01L8/mqdefault.jpg", "channel": "Kurzgesagt", "duration": "8:10"},
            {"title": "Solar System 101 | National Geographic", "url": "https://www.youtube.com/watch?v=jHE_RfR5Kus", "thumbnail": "https://i.ytimg.com/vi/jHE_RfR5Kus/mqdefault.jpg", "channel": "Nat Geo", "duration": "4:14"},
        ]
    }
    q = query.lower()
    for key, vids in FALLBACK.items():
        if key in q:
            return vids
    return FALLBACK["default"]


# ==========================================================
#  AI QUIZ GENERATION  (Pollinations.ai — free, no key)
# ==========================================================

def _try_ai_generation(quiz):
    """
    Generate fresh questions every call.
    Cache-busting strategy:
      1. Random seed injected into the prompt text itself
      2. Uses POST /v1/chat (JSON body) on Pollinations — POST is never cached
      3. Adds 'seed' parameter in the request body
      4. Picks a random angle/theme to vary question style
    """
    import time as _time

    try:
        topic      = quiz["title"]
        difficulty = quiz["difficulty"]
        n          = quiz["total_questions"]

        # Random seed + varied angle so every prompt is unique
        seed  = random.randint(100000, 999999)
        angle = random.choice([
            "focus on surprising facts",
            "focus on measurements and numbers",
            "focus on comparisons between planets",
            "focus on history of discovery",
            "focus on physical characteristics",
            "focus on fun and unusual trivia",
            "focus on space missions and exploration",
            "focus on moons, rings and other features",
        ])

        prompt = (
            f"[seed:{seed}] Generate exactly {n} fresh multiple-choice quiz questions "
            f"about \"{topic}\" for school students aged 10-16 (difficulty: {difficulty}). "
            f"Variation style: {angle}. "
            "Make sure ALL questions are different from standard textbook questions — be creative. "
            "Each question must have exactly 4 answer options. "
            "Return ONLY a valid JSON array with no markdown, no extra text, no explanation. "
            "Exact format: [{\"question\": \"...\", \"options\": [\"opt1\",\"opt2\",\"opt3\",\"opt4\"], \"answer\": 0}] "
            "where 'answer' is the 0-based index of the correct option."
        )

        # --- Try Pollinations Chat API (POST, never cached) ---
        payload = json.dumps({
            "messages": [{"role": "user", "content": prompt}],
            "model": "openai",
            "seed": seed,
            "jsonMode": True
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://text.pollinations.ai/openai",
            data=payload,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            },
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=25) as resp:
            raw = resp.read().decode("utf-8", errors="ignore").strip()

        # Try parsing as OpenAI-style chat response first
        try:
            parsed = json.loads(raw)
            # OpenAI format: choices[0].message.content
            if "choices" in parsed:
                raw = parsed["choices"][0]["message"]["content"]
            elif "content" in parsed:
                raw = parsed["content"]
        except Exception:
            pass  # raw is already plain text

        return _parse_and_validate_questions(raw)

    except Exception:
        # --- Fallback: GET with cache-busting seed in the URL ---
        try:
            seed2  = random.randint(100000, 999999)
            angle2 = random.choice([
                "unusual angle", "trivia style", "explorer perspective",
                "scientist viewpoint", "astronaut experience"
            ])
            prompt2 = (
                f"[uid:{seed2}-{int(_time.time())}] Create {quiz['total_questions']} unique "
                f"multiple-choice questions about \"{quiz['title']}\" ({quiz['difficulty']}, {angle2}). "
                "4 options each. JSON only: "
                "[{\"question\":\"...\",\"options\":[\"a\",\"b\",\"c\",\"d\"],\"answer\":0}]"
            )
            encoded = urllib.parse.quote(prompt2)
            req2 = urllib.request.Request(
                f"https://text.pollinations.ai/{encoded}?seed={seed2}",
                headers={"User-Agent": f"Mozilla/5.0 uid-{seed2}"}
            )
            with urllib.request.urlopen(req2, timeout=22) as resp2:
                raw2 = resp2.read().decode("utf-8", errors="ignore").strip()
            return _parse_and_validate_questions(raw2)
        except Exception:
            return None


def _parse_and_validate_questions(raw):
    """Parse raw AI text into a validated list of question dicts."""
    if not raw:
        return None

    # Strip markdown fences
    if raw.startswith("```"):
        raw = "\n".join(raw.split("\n")[1:])
    if raw.endswith("```"):
        raw = raw.rsplit("```", 1)[0]
    raw = raw.strip()

    # Find JSON array bounds
    start = raw.find("[")
    end   = raw.rfind("]") + 1
    if start == -1 or end == 0:
        return None

    try:
        questions = json.loads(raw[start:end])
    except Exception:
        return None

    validated = []
    for q in questions:
        if not isinstance(q, dict):
            continue
        qtext   = q.get("question") or q.get("text") or ""
        options = q.get("options")  or q.get("choices") or []
        answer  = q.get("answer", 0)

        if not qtext or not isinstance(options, list) or len(options) < 2:
            continue
        if not isinstance(answer, int) or answer < 0 or answer >= len(options):
            answer = 0

        validated.append({
            "question": str(qtext).strip(),
            "options":  [str(o).strip() for o in options],
            "answer":   answer
        })

    return validated if len(validated) >= 5 else None


def build_result_details_flex(questions, submitted_answers):
    result_details  = []
    correct_answers = 0
    for index, question in enumerate(questions):
        qtext         = question.get("question") or question.get("text") or ""
        options       = question.get("options")  or question.get("choices") or []
        correct_index = question.get("answer", 0)
        chosen_index  = submitted_answers[index] if index < len(submitted_answers) else None
        is_correct    = chosen_index == correct_index
        if is_correct:
            correct_answers += 1
        chosen_option = None
        if isinstance(chosen_index, int) and 0 <= chosen_index < len(options):
            chosen_option = options[chosen_index]
        result_details.append({
            "number":         index + 1,
            "question":       qtext,
            "options":        options,
            "correct_index":  correct_index,
            "correct_option": options[correct_index] if 0 <= correct_index < len(options) else "",
            "chosen_index":   chosen_index,
            "chosen_option":  chosen_option,
            "is_correct":     is_correct
        })
    return result_details, correct_answers


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            return jsonify({'success': False, 'message': 'All fields required'}), 400

        try:
            db = get_db()
            cursor = db.cursor()
            hashed_password = generate_password_hash(password)

            cursor.execute('''
                INSERT INTO users (username, email, password)
                VALUES (?, ?, ?)
            ''', (username, email, hashed_password))

            db.commit()
            db.close()

            return jsonify({'success': True, 'message': 'Registration successful! Please login.'}), 201

        except sqlite3.IntegrityError:
            return jsonify({'success': False, 'message': 'Username or email already exists'}), 400
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return jsonify({'success': False, 'message': 'Username and password required'}), 400

        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()
            db.close()

            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['username'] = user['username']
                return jsonify({'success': True, 'message': 'Login successful!'}), 200
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))


@app.route('/dashboard')
@login_required
def dashboard():
    username = session.get('username')
    return render_template('dashboard.html', username=username, quiz_catalog=get_quiz_catalog())


@app.route('/visualizer')
def visualizer():
    return render_template('visualizer.html')


@app.route('/planet/<planet_key>')
def planet_detail(planet_key):
    planet_key = planet_key.lower().strip()
    planet = PLANET_DETAILS.get(planet_key)

    if not planet:
        abort(404)

    planet_keys = list(PLANET_DETAILS.keys())
    current_index = planet_keys.index(planet_key)
    previous_planet = planet_keys[current_index - 1] if current_index > 0 else None
    next_planet = planet_keys[current_index + 1] if current_index < len(planet_keys) - 1 else None

    return render_template(
        'planet_detail.html',
        planet=planet,
        planet_key=planet_key,
        previous_planet=previous_planet,
        next_planet=next_planet
    )


@app.route('/quiz/<quiz_id>')
@login_required
def quiz_page(quiz_id):
    quiz = QUIZ_BANK.get(quiz_id)
    if not quiz:
        abort(404)

    return render_template('quiz.html', quiz_id=quiz_id, quiz=quiz)


@app.route('/quiz-result/<int:attempt_id>')
@login_required
def quiz_result_page(attempt_id):
    user_id = session.get('user_id')
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?',
        (attempt_id, user_id)
    )
    attempt = cursor.fetchone()
    db.close()

    if not attempt:
        abort(404)

    attempt_dict = dict(attempt)
    attempt_dict['result_details'] = json.loads(attempt_dict['result_details'])
    attempt_dict['user_answers'] = json.loads(attempt_dict['user_answers'])
    attempt_dict['completed_at'] = datetime.fromisoformat(attempt_dict['completed_at'])

    return render_template('quiz_result.html', attempt=attempt_dict)


@app.route('/api/user/profile')
@login_required
def get_user_profile():
    user_id = session.get('user_id')
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    db.close()

    if user:
        return jsonify({
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'created_at': user['created_at']
        }), 200
    return jsonify({'message': 'User not found'}), 404


@app.route('/api/simulations', methods=['GET', 'POST'])
@login_required
def handle_simulations():
    user_id = session.get('user_id')
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute(
            'SELECT id, name, created_at FROM simulations WHERE user_id = ? ORDER BY created_at DESC',
            (user_id,)
        )
        simulations = [dict(row) for row in cursor.fetchall()]
        db.close()
        return jsonify(simulations), 200

    data = request.get_json()
    name = data.get('name')
    simulation_data = data.get('data')

    if not name:
        return jsonify({'success': False, 'message': 'Simulation name required'}), 400

    try:
        cursor.execute('''
            INSERT INTO simulations (user_id, name, simulation_data)
            VALUES (?, ?, ?)
        ''', (user_id, name, simulation_data))

        db.commit()
        simulation_id = cursor.lastrowid
        db.close()

        return jsonify({
            'success': True,
            'message': 'Simulation saved!',
            'id': simulation_id
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/quizzes/stats')
@login_required
def get_quiz_stats():
    user_id = session.get('user_id')
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC',
        (user_id,)
    )
    attempts = cursor.fetchall()
    db.close()

    if not attempts:
        return jsonify({
            'completed': 0,
            'averageScore': 0,
            'totalPoints': 0,
            'currentStreak': 0,
            'completedQuizzes': []
        }), 200

    completed = len(attempts)
    average_score = round(sum(row['score'] for row in attempts) / completed)
    total_points = sum(row['correct_answers'] * 10 for row in attempts)
    current_streak = calculate_streak(attempts)

    completed_quizzes = []
    for row in attempts:
        completed_quizzes.append({
            'attemptId': row['id'],
            'name': row['quiz_name'],
            'score': int(round(row['score'])),
            'correctAnswers': row['correct_answers'],
            'totalQuestions': row['total_questions'],
            'timeTaken': round(row['time_taken_seconds'] / 60, 1),
            'completedAt': row['completed_at']
        })

    return jsonify({
        'completed': completed,
        'averageScore': average_score,
        'totalPoints': total_points,
        'currentStreak': current_streak,
        'completedQuizzes': completed_quizzes
    }), 200


@app.route('/api/quiz/<quiz_id>')
@login_required
def get_quiz_data(quiz_id):
    quiz = get_public_quiz(quiz_id)
    if not quiz:
        return jsonify({'success': False, 'message': 'Quiz not found'}), 404
    return jsonify(quiz), 200


@app.route('/api/quiz/<quiz_id>/submit', methods=['POST'])
@login_required
def submit_quiz(quiz_id):
    quiz = QUIZ_BANK.get(quiz_id)
    if not quiz:
        return jsonify({'success': False, 'message': 'Quiz not found'}), 404

    data = request.get_json() or {}
    submitted_answers  = data.get('answers', [])
    time_taken_seconds = int(data.get('timeTakenSeconds', 0))
    ai_questions       = data.get('aiQuestions')  # present when AI-generated

    grade_questions = (
        ai_questions if ai_questions and isinstance(ai_questions, list) and len(ai_questions) > 0
        else quiz['questions']
    )
    total_questions = len(grade_questions)

    if not isinstance(submitted_answers, list) or len(submitted_answers) != total_questions:
        return jsonify({'success': False, 'message': f'Please answer all {total_questions} questions before submitting.'}), 400

    cleaned_answers = []
    for answer in submitted_answers:
        if answer is None:
            cleaned_answers.append(None)
            continue
        if not isinstance(answer, int):
            return jsonify({'success': False, 'message': 'Invalid answer format detected.'}), 400
        cleaned_answers.append(answer)

    result_details, correct_answers = build_result_details_flex(grade_questions, cleaned_answers)
    score = round((correct_answers / total_questions) * 100, 2)

    user_id = session.get('user_id')
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO quiz_attempts (
            user_id, quiz_id, quiz_name, score, correct_answers, total_questions,
            time_taken_seconds, user_answers, result_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id, quiz_id, quiz['title'], score, correct_answers, total_questions,
        time_taken_seconds, json.dumps(cleaned_answers), json.dumps(result_details)
    ))
    db.commit()
    attempt_id = cursor.lastrowid
    db.close()

    return jsonify({
        'success': True,
        'attemptId': attempt_id,
        'score': score,
        'correctAnswers': correct_answers,
        'totalQuestions': total_questions,
        'resultUrl': url_for('quiz_result_page', attempt_id=attempt_id)
    }), 200




@app.route('/api/quiz/youtube-recommendations')
@login_required
def youtube_recommendations():
    topic = request.args.get('topic', 'solar system for students')
    videos = search_youtube(topic, max_results=3)
    return jsonify({'videos': videos}), 200


@app.route('/api/quiz/<quiz_id>/generate', methods=['POST'])
@login_required
def generate_quiz(quiz_id):
    quiz = QUIZ_BANK.get(quiz_id)
    if not quiz:
        return jsonify({'success': False, 'message': 'Quiz not found'}), 404

    ai_questions = _try_ai_generation(quiz)
    if ai_questions:
        return jsonify({
            'success': True, 'source': 'ai',
            'id': quiz_id, 'title': quiz['title'],
            'description': quiz['description'],
            'difficulty': quiz['difficulty'],
            'duration_minutes': quiz['duration_minutes'],
            'total_questions': len(ai_questions),
            'questions': ai_questions
        }), 200

    shuffled = random.sample(quiz['questions'], len(quiz['questions']))
    public_questions = [
        {'number': i+1, 'question': q['question'], 'options': q['options'], 'answer': q['answer']}
        for i, q in enumerate(shuffled)
    ]
    return jsonify({
        'success': True, 'source': 'ai',
        'id': quiz_id, 'title': quiz['title'],
        'description': quiz['description'],
        'difficulty': quiz['difficulty'],
        'duration_minutes': quiz['duration_minutes'],
        'total_questions': len(public_questions),
        'questions': public_questions
    }), 200

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)