import React from "react";
import { TouchableHighlight, View, Text, TextInput, StyleSheet, Button } from 'react-native'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag'

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class IssueAdd extends React.Component {
   constructor() {
       super();
       this.handleSubmit = this.handleSubmit.bind(this);
       this.state = {name: '', contact: ''}
   }

   handleSubmit(e) {
       e.preventDefault();
       const issue = {name: this.state.name, contact: this.state.contact, id: this.state.name + this.state.contact, time: new Date(),}
       if (this.state.name.length==0){
           alert("Customer inofrmation can not be null!")
       }
       else {
           this.props.createIssue(issue);
           alert("Successfully submitted!")
           this.setState({ name: '', contact: '' });
       }
   }

   render() {
       return (
        <View>
        <TextInput
            style={styles.input}
            placeholder="Full name"
            keyboardType="default"
            onChangeText={(name) => this.setState({name})}
        />
        <TextInput
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
            onChangeText={(contact) => this.setState({contact})}
        />
        <View style={styles.button}>
            <Button
            activeOpacity={0.5}
            onPress={this.handleSubmit}
            title="Submit"
            color="#5f9ea0"
            />
        </View>

       </View>
       );
   }
}

async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch('http://192.168.50.220:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
}

class WaitlistSystem extends React.Component {
   constructor() {
       super();
       this.state = { issues: [] };
       this.createIssue = this.createIssue.bind(this);
   }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issueList {
                id name contact time 
            }
        }`;

        const data = await graphQLFetch(query); 
        if (data) { 
            this.setState({ issues: data.issueList }); 
        }
    }

    async createIssue(issue) {
        if (this.state.issues.length<25){
            const query = `mutation {
                issueAdd(issue:{
                    id: "${issue.id}"
                    name: "${issue.name}",
                    contact: "${issue.contact}",
                    time: "${issue.time}",
                }) {
                  id
                }
              }`;

            const data = await graphQLFetch(query, { issue }); 
            if (data) { 
                this.loadData(); 
            }
        }
        else{
            alert ("Waitlist is already full!")
        }
    }

   render() {
       const buttonReserve = this.state.buttonReserve
       return (
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 30, color:"#5f9ea0"}}>Hotel California International</Text>
            <Text style={{textAlign: 'center', fontSize: 20}}>Add a reservation</Text>
            <Text> Please submit your name and phone number: </Text>

            <IssueAdd createIssue={this.createIssue}/>

        </View>
       );
   }
}

styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      backgroundColor: '#dddddd',
      height: 50,
      margin: 20,
      marginBottom: 0,
      paddingLeft: 10
    },
    button: {
        justifyContent: 'space-between',
        margin: 20,
        width: 200,
        borderRadius: 40,
        alignSelf:'center',
        marginVertical: 8,
    },
})

export default WaitlistSystem;

