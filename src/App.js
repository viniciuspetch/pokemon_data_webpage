import React from "react";
import "./App.css";
import { pokemonList } from "./PokeList.js";
import Cookies from "universal-cookie";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class PokemonImage extends React.Component {
  render() {
    if (this.props.pokemon != null) {
      return (
        <img
          src={this.props.pokemon.sprites.front_default}
          alt="Pokémon sprite"
        />
      );
    } else {
      return null;
    }
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    let pokemonName = e.target.pokemonName.value;
    this.props.onInput(pokemonName);
  }

  handleChange(e) {
    e.preventDefault();
    let pokemonName = e.target.value;
    this.props.onChange(pokemonName);
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formSearch">
          <Form.Label>Search Pokémon by name or number:</Form.Label>
          <Form.Control
            type="text"
            name="pokemonName"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      /*
      <form onSubmit={this.handleInput}>
        <label>
          Search Pokémon by name or number:
          <input type="text" name="pokemonName" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Search" />
      </form>
      */
    );
  }
}

class PokemonName extends React.Component {
  render() {
    if (this.props.pokemon == null) {
      return null;
    } else {
      let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
      let url_suffix = "_(Pokémon)";
      let name_uppercased =
        this.props.pokemon.name[0].toUpperCase() +
        this.props.pokemon.name.slice(1);
      return (
        <div>
          <a href={url_prefix + name_uppercased + url_suffix}>
            nº {this.props.pokemon.id} - {name_uppercased}
          </a>
        </div>
      );
    }
  }
}

class PokemonDataTab extends React.Component {
  constructor(props) {
    super(props);

    this.getAbilities = this.getAbilities.bind(this);
    this.getTypes = this.getTypes.bind(this);
  }

  getAbilities() {
    let abilitiesList = [];
    if (this.props.pokemon != null) {
      abilitiesList = this.props.pokemon.abilities.map((ability, index) => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(Ability)";
        let name_fixed = ability.ability.name
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ");

        return (
          <a
            key={index.toString()}
            href={url_prefix + name_fixed.replace(" ", "_") + url_suffix}
          >
            <div className="listItem">
              {name_fixed + (ability.is_hidden ? " (Hidden)" : "")}
            </div>
          </a>
        );
      });
    }

    return abilitiesList.reverse();
  }

  getTypes() {
    let typesList = [];
    if (this.props.pokemon != null) {
      typesList = this.props.pokemon.types.map((type, index) => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(type)";
        let name_fixed =
          type.type.name[0].toUpperCase() + type.type.name.slice(1);

        return (
          <a key={index.toString()} href={url_prefix + name_fixed + url_suffix}>
            <div className="listItem">{name_fixed}</div>
          </a>
        );
      });
    }

    return typesList.reverse();
  }

  render() {
    let abilitiesList = this.getAbilities();
    let typesList = this.getTypes();

    return (
      <div className="lists">
        <div className="list abilitiesList">{abilitiesList}</div>
        <div className="list typesList">{typesList}</div>
      </div>
    );
  }
}

class PokemonStatsTab extends React.Component {
  render() {
    if (this.props.pokemon) {
      return (
        <>
          <p style={{ margin: "5px 0" }}>
            HP: {this.props.pokemon.stats[5].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[5].base_stat }}
          ></div>
          <p style={{ margin: "5px 0" }}>
            Attack: {this.props.pokemon.stats[4].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[4].base_stat }}
          ></div>
          <p style={{ margin: "5px 0" }}>
            Defense: {this.props.pokemon.stats[3].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[3].base_stat }}
          ></div>
          <p style={{ margin: "5px 0" }}>
            Special Attack: {this.props.pokemon.stats[2].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[2].base_stat }}
          ></div>
          <p style={{ margin: "5px 0" }}>
            Special Defense: {this.props.pokemon.stats[1].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[1].base_stat }}
          ></div>
          <p style={{ margin: "5px 0" }}>
            Speed: {this.props.pokemon.stats[0].base_stat}
          </p>
          <div
            className="statbox"
            style={{ width: this.props.pokemon.stats[0].base_stat }}
          ></div>
        </>
      );
    } else return null;
  }
}

class PokemonMovesetTab extends React.Component {
  render() {
    if (this.props.pokemon == null) {
      return null;
    }
    let moveset_machine = [];
    let moveset_levelup = [];
    let moveset_egg = [];
    let moveset_other = [];
    for (let i in this.props.pokemon.moves) {
      let move = this.props.pokemon.moves[i];
      if (move.version_group_details[0].move_learn_method.name === "machine") {
        moveset_machine.push(move);
      } else if (
        move.version_group_details[0].move_learn_method.name === "egg"
      ) {
        moveset_egg.push(move);
      } else if (
        move.version_group_details[0].move_learn_method.name === "level-up"
      ) {
        moveset_levelup.push(move);
      } else {
        moveset_other.push(move);
      }
    }
    let list_levelup = moveset_levelup
      .map((item) =>
        item.move.name
          .split("-")
          .map((a) => a[0].toUpperCase() + a.slice(1))
          .join(" ")
      )
      .join(", ");
    let list_machine = moveset_machine
      .map((item) =>
        item.move.name
          .split("-")
          .map((a) => a[0].toUpperCase() + a.slice(1))
          .join(" ")
      )
      .join(", ");
    let list_egg = moveset_egg
      .map((item) =>
        item.move.name
          .split("-")
          .map((a) => a[0].toUpperCase() + a.slice(1))
          .join(" ")
      )
      .join(", ");
    let list_other = moveset_other
      .map((item) =>
        item.move.name
          .split("-")
          .map((a) => a[0].toUpperCase() + a.slice(1))
          .join(" ")
      )
      .join(", ");

    return (
      <div>
        <div className="moveset_group">
          <h3>Level-up</h3>
          <p>{list_levelup}</p>
        </div>
        <div className="moveset_group">
          <h3>TMs and HMs</h3>
          <p>{list_machine}</p>
        </div>
        <div className="moveset_group">
          <h3>Egg moves</h3>
          <p>{list_egg}</p>
        </div>
        <div className="moveset_group">
          <h3>Other means</h3>
          <p>{list_other}</p>
        </div>
      </div>
    );
  }
}

function PokemonList(props) {
  return (
    <>
      {props.pokemonList}
      <br />
    </>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonName: "",
      searchResult: "",
      pokemon: null,
      currTab: 1,
      pokemonNumber: null,
      pokemonList: this.filterPokemonList(""),
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
    this.setTab = this.setTab.bind(this);
    this.getPreviousPokemon = this.getPreviousPokemon.bind(this);
    this.getNextPokemon = this.getNextPokemon.bind(this);
  }

  componentDidMount() {
    this.filterPokemonList();
  }

  filterPokemonList(pokemonName) {
    let rawList = [];
    for (let key in pokemonList) {
      rawList = rawList.concat(pokemonList[key]);
    }

    return rawList.filter((item) => item.toLowerCase().includes(pokemonName));
  }

  handleInput(pokemonName) {
    if (pokemonName) {
      pokemonName = pokemonName.toLowerCase().trim();
    }

    this.searchPokemon(pokemonName);
  }

  handleChange(pokemonName) {
    if (pokemonName) {
      pokemonName = pokemonName.toLowerCase().trim();
    }

    this.setState({
      pokemonName: pokemonName,
      pokemonList: this.filterPokemonList(pokemonName),
    });
  }

  searchPokemon(pokemonName) {
    if (pokemonName != null) {
      if (!isNaN(pokemonName)) {
        pokemonName = parseInt(pokemonName);
      } else {
        pokemonName = pokemonName.toLowerCase();
      }
    }
    console.log("Pokemon searched: " + pokemonName);

    if (
      isNaN(pokemonName) &&
      !this.state.pokemonList.find((name) => {
        return name.toLowerCase().trim() === pokemonName.toLowerCase().trim();
      })
    ) {
      console.log("Search blocked by list");
      return null;
    }

    const cookies = new Cookies();
    let lastPokemons = cookies.get("lastPokemons");
    for (let i = 0; i < 4; i++) {
      lastPokemons[i] = lastPokemons[i + 1];
    }
    lastPokemons[4] = pokemonName;
    cookies.set("lastPokemons", lastPokemons);
    console.log(lastPokemons);

    this.setState({ pokemon: null });
    const Pokedex = require("pokeapi-js-wrapper");
    const P = new Pokedex.Pokedex();
    let self = this;

    P.getPokemonByName(pokemonName)
      .then(function (response) {
        self.setState({
          currTab: 1,
          pokemon: response,
          pokemonNumber: response.game_indices[0].game_index,
        });
      })
      .catch(function (error) {
        self.setState({ pokemon: null });
      });
  }

  getPreviousPokemon() {
    this.searchPokemon(this.state.pokemonNumber - 1);
  }

  getNextPokemon() {
    this.searchPokemon(this.state.pokemonNumber + 1);
  }

  setTab(e) {
    this.setState({
      currTab: parseInt(e.target.value),
    });
  }

  render() {
    const cookies = new Cookies();
    if (!cookies.get("lastPokemons")) {
      cookies.set("lastPokemons", []);
    }
    let lastPokemons = Object.values(cookies.get("lastPokemons"))
      .reverse()
      .map((value, index) => {
        if (typeof value == "string") {
          value = value[0].toUpperCase() + value.slice(1);
        }
        if (typeof value == "number") {
          value = <i>{"Pokémon nº " + value}</i>;
        }
        return (
          <div key={index}>
            {value}
            <br />
          </div>
        );
      });
    let currTab = null;
    switch (this.state.currTab) {
      case 1:
        currTab = <PokemonDataTab pokemon={this.state.pokemon} />;
        break;
      case 2:
        currTab = <PokemonStatsTab pokemon={this.state.pokemon} />;
        break;
      case 3:
        currTab = <PokemonMovesetTab pokemon={this.state.pokemon} />;
        break;
      default:
        currTab = <h1>Error</h1>;
    }

    let scrollButtons = null;
    if (this.state.pokemon) {
      scrollButtons = (
        <>
          <button onClick={this.getPreviousPokemon}>Previous</button>
          <button onClick={this.getNextPokemon}>Next</button>
        </>
      );
    }

    return (
      <div className="App">
        {scrollButtons}
        {lastPokemons}
        <SearchForm onChange={this.handleChange} onInput={this.handleInput} />
        <PokemonList pokemonList={this.state.pokemonList} />
        <PokemonName pokemon={this.state.pokemon} />
        <button value="1" onClick={this.setTab}>
          Data
        </button>
        <button value="2" onClick={this.setTab}>
          Stats
        </button>
        <button value="3" onClick={this.setTab}>
          Moveset
        </button>
        <div>
          <PokemonImage pokemon={this.state.pokemon} />
        </div>
        <div>{currTab}</div>
      </div>
    );
  }
}

export default App;
