# Welcome to VTC Challenge

This challenge is created to test your knowledge of creating Symfony Applications with SPA Frontend build using ReactJS.
In order to start working your solution, please clone this repository and create a copy under your namespace. 
Consider also to change name of your project to make it harder to find your solution by other competitors.

**DO NOT FORK THIS REPOSITORY, THIS WILL ALLOW OTHERS TO COPY YOUR SOLUTION**

## Challenge

Based on this bare-bones application create a service that will allow:
* registration of a user
* confirming account by clicking a link from email. (no need to send actual email, email can be persisted as a file in var/emails directory)
* users to login
* users to create notes
* each note should have fields
  * title
  * content
  * category
  * status (new, todo, done)
* list of notes should have possibility to search notes by text from title/content, a select list for statuses and another select list for categories.

To finish this challenge you have 24h since the moment of receiving this email. Remember to push your last changes before the end of the deadline.
We will be evaluating your solution based on the time of the commit. And remember to send us back link to your solution on GitHub.

Good look.

## Help notes

### Requirements
To run this project you will need:
* Docker: >24
* Docker Compose: >1.29
* NodeJS: >18
* PHP: >7.4

### First steps:

    $ cp .env.dist .env
    $ composer install
    $ yarn install
    $ docker-compose up -d
    $ yarn watch

After running this set of commands, without errors; you should be able to open `http://localhost:81/` and see `Hello World!!!` in the middle of the page.

## Testing with SQL & API

Below are useful Docker+MySQL commands and API curl examples to help you test registration, confirmation, login and notes directly.

- List databases and tables:

```bash
# show databases
docker-compose exec db mysql -uroot -proot -e "SHOW DATABASES;"

# show tables in the app database
docker-compose exec db mysql -uroot -proot -e "USE vtc-db; SHOW TABLES;"
```

- Inspect users (view verification status and token):

```bash
docker-compose exec db mysql -uroot -proot -e "USE vtc-db; SELECT id,email,is_verified,verification_token FROM \`user\`;"
```

- Mark a user verified (SQL):

```bash
docker-compose exec db mysql -uroot -proot -e "USE vtc-db; UPDATE \`user\` SET is_verified=1, verification_token=NULL WHERE email='user@example.com';"
```

- Create / insert a note (SQL):

```bash
docker-compose exec db mysql -uroot -proot -e "USE vtc-db; INSERT INTO note (title,content,category,status,user_id,created_at) VALUES ('Test','Content','personal','new',1,NOW());"

# view notes
docker-compose exec db mysql -uroot -proot -e "USE vtc-db; SELECT * FROM note ORDER BY created_at DESC LIMIT 20;"
```

- Useful filesystem + API checks:

```bash
# Check the persisted verification emails
ls -1 var/emails
cat var/emails/registration_*.eml

# Register via API (recommended over raw SQL for proper password hashing)
curl -X POST http://localhost:81/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"passw0rd"}'

# Read the token from the latest var/emails file, then confirm:
curl "http://localhost:81/confirm?token=THE_TOKEN"

# Login (requires verified account)
curl -X POST http://localhost:81/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"passw0rd"}'

# Create a note via API (replace user_id with the logged in user's id)
curl -X POST http://localhost:81/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"API note","content":"hello","category":"work","status":"new","user_id":1}'

# List notes with filters
curl "http://localhost:81/api/notes?q=hello&status=new&category=work"
```

Notes:
- Prefer using the API endpoints for creating users (so password hashing is handled correctly).
- SQL `INSERT` into the `user` table requires a valid hashed password; use the API or generate a hash inside the container if you must insert by SQL.
- To generate a bcrypt hash inside the `web` container you can run a quick PHP snippet, for example:

```bash
docker-compose exec web php -r "echo password_hash('passw0rd', PASSWORD_BCRYPT).PHP_EOL;"
```
