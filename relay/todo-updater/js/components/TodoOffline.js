
// import * as RelayReader from 'relay-runtime/lib/RelayReader';
import React from 'react';

import { Todo } from './Todo';
/*
  version 0.4.0
import {createFragmentContainer, graphql, useIsConnected, useNetInfo } from 'react-relay-offline';
*/
import useOffline from 'react-relay-offline/lib/hooks/useOffline';

import { manualExecution } from '../relay';

const RequestOffline = ({ offlineRecord, user }) => {

    const { id, request: { payload: {operation}, backup, sink } } = offlineRecord;

    const { variables: { input }, node: { params: { name } } } = operation;

    const todoBackup = backup._records[input.id]

    let todoPublish = sink._records[input.id]

    if(name==='ChangeTodoStatusMutation') {
        todoPublish = Object.assign({}, todoPublish, {text:todoBackup.text});
    }

    const isMultiple = name ==='RemoveCompletedTodosMutation' || name ==='MarkAllTodosMutation'

    return <div className="mainrequest">
        <div className="headerrequest">
            <p key={id} className="pmutation">{name}</p>
            <div className= "mainbefore">
                <p className="mutationbefore">before</p> <p className="mutationbefore">after</p>
            </div>
        </div>
        <ul className= "listmutation">
        {!isMultiple && !todoBackup.__UNPUBLISH_RECORD_SENTINEL ? <Todo disabled todo={todoBackup} user={user} /> : <div className="emptymutation" />}

        {!isMultiple && todoPublish ? <Todo disabled todo={todoPublish} user={user} /> : <div className="emptymutation" />}
        </ul>
    </div>;
}


const TodoOffline = ({ relay, user, retry }) => {
    const offlineState = useOffline();

    const requests = [];

    Object.values(offlineState).forEach(offlineRecord => {
        requests.push(offlineRecord);
        /*
            const { request } = payload;
            const snapshot = RelayReader.read(request.sinkPublish, request.operation.fragment);
            this work only with optimisticResponse
        */
    });

    const execute = () => {
        relay.environment.getStoreOffline().execute();
    }


    if(requests.length === 0) {
        return null;
    }

    return <section className="storeapp">
        <header className="header">
            <h1>store</h1>
        </header>
        <ul className="todo-list">
            {requests && requests.map((offlineRecord) => (
                <RequestOffline key={offlineRecord.id} offlineRecord={offlineRecord} user={user} />
            ))}
        </ul>
        {manualExecution && <button
          className="buttonmutation"
          onClick={execute}>
          Execute Offline Mutation
        </button>}
    </section>

}

export default TodoOffline;