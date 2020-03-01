import requests
from bs4 import BeautifulSoup as bs
from os import path
import json

if __name__ == "__main__":
    soup = ""

    print(path.exists("website.html"))

    if (path.exists("website.html")):
        wbs_file = open("website.html", "r")
        soup = bs(wbs_file.read(), "html.parser")
    else:
        url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number'
        url_response = requests.get(url)
        soup = bs(url_response.text, "html.parser")
        wbs_file = open("website.html", "w")
        wbs_file.write(str(url_content.encode('utf-8')))
        wbs_file.close()

    table_list = soup.find_all('table')
    pokemon_list_all = []

    # 8 Generations for now, at least
    # 1st table is a "shortcut list"
    for i in range(1, 9):
        tr_list = table_list[i].find_all('tr')
        pokemon_list_gen = []
        print(len(tr_list))

        for j in range(1, len(tr_list)):
            pokemon_list_gen.append(
                tr_list[j].find_all('td')[2].get_text()[0:-2])

        pokemon_list_all.append(pokemon_list_gen.copy())

    print(pokemon_list_all)

    pokelist = {}

    for i in range(0,8):
        pokelist['gen'+str(i+1)] = pokemon_list_all[i]

    with open('pokelist.txt', 'w') as f:
        json.dump(pokelist, f)

