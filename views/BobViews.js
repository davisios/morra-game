import React from 'react';
import { toStandardCurrency } from '../helpers';
import { ThreeCircles } from  'react-loader-spinner';
export class RunBackend extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    const {connectError, loading} = parent.state;
    return (
      <div>
        {connectError ? "Error while connection to the contract, please try again or verify the information...":''}
        {!loading ? <>
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
          onClick={() => {
            parent.setLoading(true);
            parent.runBackend(ctcInfoStr)}
          }
        >Connect</button>
        </> : '' }
       
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
            parent.setLoading(true);
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
    const loading = bob?.props?.parent?.state?.loading || false;
    return (
      <div className="flex-grid hcenter tcenter" style={{width:"40%", flexFlow:'column'}}>
        <ThreeCircles
  height="100"
  width="100"
  color="#E5625E"
  visible={loading}
/>
        {bob}
      </div>
    );
  }
}
