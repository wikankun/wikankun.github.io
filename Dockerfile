FROM jekyll/jekyll:4.2.2

COPY --chown=jekyll:jekyll Gemfile .
COPY --chown=jekyll:jekyll Gemfile.lock .
COPY --chown=jekyll:jekyll no-style-please.gemspec .

RUN bundle install --quiet

CMD ["jekyll", "serve"]
# CMD ["bundle", "exec", "jekyll", "serve"]
