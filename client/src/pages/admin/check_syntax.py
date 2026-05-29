import os
import re

def check_balance(content, open_char, close_char):
    return content.count(open_char), content.count(close_char)

admin_path = r'c:\Users\user\Downloads\Projects\Cradera\MVP\client\src\pages\admin'
for filename in os.listdir(admin_path):
    if filename.endswith('.jsx'):
        path = os.path.join(admin_path, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Remove comments to avoid false positives
            content = re.sub(r'//.*', '', content)
            content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
            
            o, c = check_balance(content, '{', '}')
            if o != c:
                print(f"{filename}: Braces unbalanced! {{: {o}, }}: {c}")
            
            o, c = check_balance(content, '<', '>')
            if o != c:
                print(f"{filename}: Tags unbalanced! <: {o}, >: {c}")

            # Check for specific suspicious patterns like `??` or `?.` that might be misused
            # or stray characters like `-` outside of tags
            # (Very basic check)
            
            # Check for strings that might have unclosed quotes
            sq = content.count("'")
            dq = content.count('"')
            bt = content.count('`')
            if sq % 2 != 0:
                print(f"{filename}: Single quotes unbalanced! {sq}")
            if dq % 2 != 0:
                print(f"{filename}: Double quotes unbalanced! {dq}")
            if bt % 2 != 0:
                print(f"{filename}: Backticks unbalanced! {bt}")
