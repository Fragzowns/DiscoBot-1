/* *
 * DiscoBot - Gaymers Discord Bot
 * Copyright (C) 2015 - 2017 DiscoBot Authors
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * */
 
exports.commandValidInChannel = function(command, message) {
/*
 * Return `true` if the command is allowed in this channel, `false` if not.
 * Will DM the user and delete the message if not.
 *
 * @param command
 * @param message
 * @returns {boolean}
 */

  if (command.onlyIn.includes(message.channel.name)) {
    return true;
  }

  // Complain to the user about their mistake
  const validChannels = [];
  command.onlyIn.forEach(channelName => {
    const channel = message.guild.channels.find('name', channelName);
    // If that channel doesn't exist on this server, leave it out
    if (!channel) {
      return;
    }

    // If the user can't read messages in that channel, leave it out
    if (!channel.permissionsFor(message.member)
        .has('READ_MESSAGES')) {
      return;
    }

    validChannels.push('`' + channelName + '`');
  });

  if (validChannels.length === 0) {
    message.member.send('Sorry, that command can\'t be used in ' +
      'that channel.');
  } else if (validChannels.length === 1) {
    message.member.send('Sorry, that command can only be used ' +
      'in ' + validChannels[0] + '.');
  } else {
    message.member.send('Sorry, that command can only be used in ' +
      'the following channels: ' + validChannels.join(', ') + '.');
  }

  // Remove the problem message
  message.delete()
    .catch(reason => {
      // TODO Error handler
      console.error(reason);
    });

  return false;
}