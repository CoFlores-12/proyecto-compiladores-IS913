import json
import urllib.request

class Currency:
    def __init__(self):
        try:
            f = open("currencyHistory.json", "r")
            self.history = json.loads(f.read())
            self.data = self.history[len(self.history)-1]
            self.date = self.data["date"]
            f.close()
            f = open("currencySymbols.json", "r")
            self.symbols = json.loads(f.read())
            f.close()
        except:
            return False

    def getData(self):
        return self.data

    def getCurrency(self, currency):
        if currency not in self.data['rates']:
            return "Error: Invalid currency"
        return self.data['rates'][currency]

    def getDate(self):
        return self.date

    def getHistory(self):
        return self.history

    def getSymbols(self):
        return self.symbols["symbols"]
        
    def update(self):
        try:
            #request to API server
            contents = urllib.request.urlopen("http://api.exchangeratesapi.io/v1/latest?access_key=accc744cc95502fcdaf5a5f4b14f8d54").read()
            #read file contents
            f = open("currencyHistory.json")
            data = json.loads(f.read())
            f.close()

            data2 = json.loads(contents)

            if (data[len(data)-1]['date'] != data2['date']):
                if(len(data) == 10):
                    data.pop(0)
                data.append(data2)
                with open('currencyHistory.json', 'w') as file:
                    json.dump(data, file, indent=4)
                self.history = data
                self.data = self.history[len(self.history)-1]
                self.date = self.data["date"]
            
        except:
            return "Error getting currency lastest"
        return "successful"