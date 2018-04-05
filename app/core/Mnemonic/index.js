import React, { Component } from 'react'
import styles from './style.css'

import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import { verify } from '../../services/authentication/credentials';

const font = "'Lato', sans-serif";
const materialStyles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit
  }
})

class Mnemonic extends Component {

  constructor (props) {
    super()
    this.state = {
      phrase: props.phrase
    }
  }

  render () {
    return (
      <div className={styles.chipContainer}>
        { this.state.phrase.map((data, index) => {
            return (
              <Chip
                key={index}
                avatar={
                  <Avatar style={{fontFamily: font, fontWeight:'300', fontSize:'0.75rem',
                  backgroundColor:'#EFF5F9', color:'#777777'}}>{index + 1}</Avatar>
                }
                label={`${data}`}
                className={materialStyles.chip}
                style={{fontFamily: font, fontWeight:'400', fontSize:'0.75rem', letterSpacing: '0.03rem',
                  marginLeft: '0.35rem', marginTop: '0.35rem', marginBottom: '0.35rem',
                  backgroundColor:'#FFFFFF', color:'#555555'}}
              />
            )
          })
        }
      </div>
    )
  }
}

export default Mnemonic