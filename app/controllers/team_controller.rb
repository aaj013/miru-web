# frozen_string_literal: true

class TeamController < ApplicationController
  def index
    @teams = current_user.company.users
  end

  def update
  end

  def destroy
  end

  private
end
