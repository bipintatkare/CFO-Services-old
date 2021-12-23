def boolean(string):
    response = None
    if string == 0 or string is None:
        response = False
    if string == 1:
        response = True
    if isinstance(string, str):
        if string.lower() in ["0", "no", "false"]:
            response = False
        if string.lower() in ["1", "yes", "true"]:
            response = True
    return response