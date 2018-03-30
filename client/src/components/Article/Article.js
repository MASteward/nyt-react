import React, { Component } from "react";
import Moment from 'moment';
import { ListItem } from "../List";


export const Article = props => (
  <div>
    <div>
      <a href={props.url} target="_blank">
        <h3 className="title">{props.title}</h3>
      </a>
    </div>
    <ListItem>
      <div>
        <p className="summary">
          {props.summary}
        </p>
      </div>
    </ListItem>
  </div>
)
