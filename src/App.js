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

class PokemonDataTab extends React.Component {
  constructor(props) {
    super(props);

    this.getAbilities = this.getAbilities.bind(this);
    this.getTypes = this.getTypes.bind(this);
  }

  getAbilities() {
    let abilitiesList = "";
    if (this.props.pokemon != null) {
      abilitiesList = this.props.pokemon.abilities.map(ability => {
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

    return abilitiesList;
  }

  getTypes() {
    let typesList = "";
    if (this.props.pokemon != null) {
      typesList = this.props.pokemon.types.map(type => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(type)";
        let name_fixed =
          type.type.name[0].toUpperCase() + type.type.name.slice(1);

        return (
          <a href={url_prefix + name_fixed + url_suffix}>
            <div className="listItem">{name_fixed}</div>
          </a>
        );
      });
    }

    return typesList;
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
          <p>HP: {this.props.pokemon.stats[5].base_stat}</p>
          <p>Attack: {this.props.pokemon.stats[4].base_stat}</p>
          <p>Defense: {this.props.pokemon.stats[3].base_stat}</p>
          <p>Special Attack: {this.props.pokemon.stats[2].base_stat}</p>
          <p>Special Defense: {this.props.pokemon.stats[1].base_stat}</p>
          <p>Speed: {this.props.pokemon.stats[0].base_stat}</p>
        </>
      );
    } else return null;
  }
}

class PokemonMovesetTab extends React.Component {
  render() {
    return <p>Moveset Tab</p>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemonName: "",
      searchResult: "",
      pokemon: null,
      currTab: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
    this.setTab = this.setTab.bind(this);
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

  setTab(e) {
    /*
    console.log(e);
    console.log(e.target);
    console.log(e.target.id);    
    console.log(e.target.value);
    console.log(parseInt(e.target.value));
    */
    this.setState({
      currTab: parseInt(e.target.value)
    });
  }

  render() {
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

    return (
      <div className="App">
        <SearchForm onChange={this.handleChange} />
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
