from flask import Flask, render_template, request, jsonify
import secrets
import string

app = Flask(__name__)


def generate_password(length, uppercase, lowercase, numbers, symbols):
    character_pool = ""

    if uppercase:
        character_pool += string.ascii_uppercase

    if lowercase:
        character_pool += string.ascii_lowercase

    if numbers:
        character_pool += string.digits

    if symbols:
        character_pool += "!@#$%^&*()-_=+[]{}?"

    if not character_pool:
        raise ValueError("Select at least one character type.")

    password = "".join(
        secrets.choice(character_pool)
        for _ in range(length)
    )

    return password


def check_strength(password):
    score = 0

    if len(password) >= 8:
        score += 1

    if len(password) >= 12:
        score += 1

    if any(c.isupper() for c in password):
        score += 1

    if any(c.islower() for c in password):
        score += 1

    if any(c.isdigit() for c in password):
        score += 1

    if any(c in "!@#$%^&*()-_=+[]{}?" for c in password):
        score += 1

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    elif score == 5:
        strength = "Strong"
    else:
        strength = "Very Strong"

    return strength, score


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()

        length = int(data.get("length", 16))
        uppercase = bool(data.get("uppercase"))
        lowercase = bool(data.get("lowercase"))
        numbers = bool(data.get("numbers"))
        symbols = bool(data.get("symbols"))

        if length < 8 or length > 64:
            return jsonify({
                "error": "Password length must be between 8 and 64."
            }), 400

        if not any([uppercase, lowercase, numbers, symbols]):
            return jsonify({
                "error": "Select at least one character type."
            }), 400

        password = generate_password(
            length,
            uppercase,
            lowercase,
            numbers,
            symbols
        )

        strength, score = check_strength(password)

        return jsonify({
            "password": password,
            "strength": strength,
            "score": score
        })

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception:
        return jsonify({
            "error": "Something went wrong. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)