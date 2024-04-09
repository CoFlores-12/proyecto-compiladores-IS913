import json
import urllib.request

contents = urllib.request.urlopen("http://api.exchangeratesapi.io/v1/latest?access_key=accc744cc95502fcdaf5a5f4b14f8d54").read()

f = open("currencyHistory.data", "w").close()
f = open("currencyHistory.data", "w")
f.write(json.dumps(json.loads(contents), indent=4))
f.close()
print("updated currency")
