class Api::V1::NoteController < ApplicationController
  def create
    if user_in_environment?(params[:environment_id])
      @note = Note.new(environment_id: params[:environment_id])

      if @note.save
        render_response("success", "OK!")
      else
        render_response("error", "Failed while creating a note")
      end
    else
      render_response("error", "User isn't in the environment!")
    end
  end

  def update
    if user_in_environment?(params[:environment_id])
      @note = Note.find(params[:id])

      if @note.update(note_params)
        render_response("success", "OK!")
      else
        render_response("error", "Try again!")
      end
    else
      render_response("error", "User isn't in the environment!")
    end
  end

  def destroy
    if user_in_environment?(params[:environment_id])
      @note = Note.find(params[:id])
    
      if @note.destroy
        render_response("success", "OK!")
      else
        render_response("error", "Try again!")
      end
    else
      render_response("error", "User isn't in the environment!")
    end
  end

  private
    def note_params
      params.require(:note).permit(:title, :description, :positionX, :positionY)
    end
end
