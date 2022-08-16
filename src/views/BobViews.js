import React from 'react';
import { toStandardCurrency } from '../helpers';

export class RunBackend extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    const {connectError} = parent.state;
    return (
      <div>
        {connectError ? "Error while connection to the contract, please try again or verify the information...":''}
        <br />
        <br />
        Ask Alice for her contract info and paste it here:
        <br />
        <textarea
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.runBackend(ctcInfoStr)}
        >Connect</button>
      </div>
    );
  }
}


export class AcceptWager extends React.Component {
  render() {
    const {parent, wager} = this.props;
    const {disabled} = this.state || {};
    const formattedWager = toStandardCurrency(wager);
    return (
      <div className='Bob'>
        do you accept to pay {formattedWager} to play?
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.resolveAcceptWager();
          }}
        >Yes !</button>
      </div>
      
    );
  }
}
export class BobWrapper extends React.Component {
  render() {
    const {bob} = this.props;
    return (
      <div className="flex-grid hcenter tcenter" style={{width:"40%", flexFlow:'column'}}>
        {bob}
      </div>
    );
  }
}
