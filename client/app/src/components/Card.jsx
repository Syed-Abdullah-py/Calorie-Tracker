import React from 'react';
import '../css/Card.css';

function Card({ user }) {
  return (
    <div className="user-card">
      <h2>User Information</h2>
      <table>
        <tbody>
          <tr>
            <td><b>First Name:</b></td>
            <td>{user.firstName}</td>
          </tr>
          <tr>
            <td><b>Last Name:</b></td>
            <td>{user.lastName}</td>
          </tr>
          <tr>
            <td><b>Email:</b></td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td><b>Gender:</b></td>
            <td>{user.gender}</td>
          </tr>
          <tr>
            <td><b>Age:</b></td>
            <td>{user.age}</td>
          </tr>
          <tr>
            <td><b>Height (cm):</b></td>
            <td>{user.height}</td>
          </tr>
          <tr>
            <td><b>Weight (kg):</b></td>
            <td>{user.weight}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Card;
