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

class PokemonName extends React.Component {
  render() {
    if (this.props.pokemon == null) {
      return null;
    } else {
      return (
        <div>
          nº {this.props.pokemon.id} -{" "}
          {this.props.pokemon.name[0].toUpperCase() +
            this.props.pokemon.name.slice(1)}
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
        console.log(response);
        self.setState({ pokemon: response });

        console.log(response.abilities);
        console.log(response.abilities[0].ability.name);
      })
      .catch(function(error) {
        console.log(error);
        self.setState({ pokemon: null });
      });
  }

  render() {
    let abilitiesList = "";
    if (this.state.pokemon != null) {
      abilitiesList = this.state.pokemon.abilities.map(ability => (
        <div className="listItem">{ability.ability.name}</div>
      ));
    }

    let typesList = "";
    if (this.state.pokemon != null) {
      typesList = this.state.pokemon.types.map(type => (
        <div className="listItem">{type.type.name}</div>
      ));
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
