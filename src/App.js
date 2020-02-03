import React from "react";
import "./App.css";

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
    this.test = this.test.bind(this);
  }

  test(e) {
    e.preventDefault();
    let pokemonName = e.target.pokemonName.value;
    this.props.onChange(pokemonName);
  }

  render() {
    return (
      <form onSubmit={this.test}>
        <label>
          Pokémon name:
          <input type="text" name="pokemonName" />
        </label>
        <input type="submit" value="Search" />
      </form>
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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonName: "",
      searchResult: "",
      pokemon: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
  }

  handleChange(pokemonName) {
    this.setState({ pokemonName: pokemonName });
    this.searchPokemon(pokemonName);
  }

  searchPokemon(pokemonName) {
    this.setState({ pokemon: null });
    const Pokedex = require("pokeapi-js-wrapper");
    const P = new Pokedex.Pokedex();
    let self = this;

    P.getPokemonByName(pokemonName)
      .then(function(response) {
        self.setState({ pokemon: response });
      })
      .catch(function(error) {
        self.setState({ pokemon: null });
      });
  }

  render() {
    let abilitiesList = "";
    if (this.state.pokemon != null) {
      abilitiesList = this.state.pokemon.abilities.map(ability => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(Ability)";
        let name_fixed = ability.ability.name
          .split("-")
          .map(part => part[0].toUpperCase() + part.slice(1))
          .join(" ");
        return (
          <a href={url_prefix + name_fixed.replace(" ", "_") + url_suffix}>
            <div className="listItem">{name_fixed}</div>
          </a>
        );
      });
    }

    let typesList = "";
    if (this.state.pokemon != null) {
      typesList = this.state.pokemon.types.map(type => {
        let name_fixed =
          type.type.name[0].toUpperCase() + type.type.name.slice(1);
        return <div className="listItem">{name_fixed}</div>;
      });
    }

    return (
      <div className="App">
        <SearchForm onChange={this.handleChange} />
        <PokemonName pokemon={this.state.pokemon} />
        <div>
          <PokemonImage pokemon={this.state.pokemon} />
        </div>
        <div className="lists">
          <div className="list abilitiesList">{abilitiesList}</div>
          <div className="list typesList">{typesList}</div>
        </div>
      </div>
    );
  }
}

export default App;
