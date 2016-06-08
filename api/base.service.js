export default class Service {

  constructor(model) {
    this.model = model;
  }

  findById(id, {requester, requestId, source} = {}) {
    var Model = this.model;
    return Model
      .where('id', id)
      .fetch()
      .then(entity => entity && entity.toJSON());
  }

  findAll({requester, requestId, source} = {}) {
    var Model = this.model;
    return Model
      .fetchAll()
      .then(models => models && models.toJSON());
  }

  create(newEntity, {requester, requestId, source} = {}) {
    var Model = this.model;
    return Model
      .forge(newEntity)
      .save()
      .then(entity => entity && entity.toJSON());
  }

  delete(id, {requester, requestId, source} = {}) {
    var Model = this.model;

    return Model
      .forge({id})
      .destroy()
      .then(entity => entity && entity.toJSON());
  }

  update(entity, changes, {requester, requestId, source} = {}) {
    var Model = this.model;

    return Model
      .forge(entity)
      .set(changes)
      .save()
      .then(saved => saved && saved.toJSON());
  }
}
