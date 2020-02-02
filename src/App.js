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
    console.log(pokemonName);
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
    const Pokedex = require("pokeapi-js-wrapper");
    const P = new Pokedex.Pokedex();
    console.log(pokemonName);
    let self = this;

    P.getPokemonByName(pokemonName).then(function(response) {
      console.log(response);
      self.setState({ pokemon: response });
    });
  }

  render() {
    return (
      <div className="App">
        <SearchForm onChange={this.handleChange} />
        <br />
        {this.state.pokemonName}
        <br />
        <PokemonImage pokemon={this.state.pokemon} />
      </div>
    );
  }
}

export default App;
